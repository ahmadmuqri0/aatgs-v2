import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY, GEMINI_MODEL, UPLOAD_DIR } from '$app/env/private';
import z from 'zod';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { assignment, generation, task } from '#lib/server/db/schema/index.ts';
import { notifyAssignmentsChanged } from '#lib/server/events.ts';

export const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    timeout: 2 * 60 * 1000,
    retryOptions: { attempts: 4, initialDelay: 2, maxDelay: 20 }
  }
});

const generatedTasksSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z
          .string()
          .trim()
          .min(1)
          .describe('Short imperative step, e.g. "Draft the introduction"'),
        description: z
          .string()
          .trim()
          .describe('What to do in this step and what counts as done, based on the brief')
      })
    )
    .describe('Ordered steps; empty if the document is not an assignment brief')
});

const SYSTEM_PROMPT = `
  You turn a student's assignment brief into a step-by-step task list they can follow to complete the assignment.

  Rules:
  - Cover every numbered or bulleted requirement in the brief with a task. Merge trivial requirements together and split large ones into steps.
  - Make each task concrete and actionable, small enough to finish in one sitting.
  - Follow the order of the brief, unless a step depends on one that comes later.
  - Put sub-requirements (bullet points under a requirement) in that task's description instead of making separate tasks.
  - Give each task a clear, concise title and a description of what to do and what counts as done.
  - Cover every deliverable and marking criterion stated in the brief.
  - Only use requirements stated in the brief; do not invent word counts, formats, tools or deadlines.
  - Finish with reviewing the work against the brief and submitting it as the brief instructs.
  - If the document is not an assignment brief, return an empty task list.`;

export async function startGeneration(assignmentId: string) {
  const [row] = await db
    .insert(generation)
    .values({ assignmentId, model: GEMINI_MODEL })
    .returning({ id: generation.id });

  void runGeneration(row.id);
  return row.id;
}

export async function runGeneration(generationId: string) {
  let userId: string | undefined;

  try {
    const gen = await db.query.generation.findFirst({
      where: { id: generationId },
      with: { assignment: { columns: { userId: true, fileKey: true, fileMimeType: true } } }
    });

    if (!gen || gen.status !== 'pending') return;
    if (!gen.assignment) throw new Error('Assignment not found');
    userId = gen.assignment.userId;

    const file = await readFile(path.join(UPLOAD_DIR, gen.assignment.fileKey));

    const res = await gemini.models.generateContent({
      model: gen.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: { mimeType: gen.assignment.fileMimeType, data: file.toString('base64') }
            },
            { text: 'Generate the task list for this assignment brief.' }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseJsonSchema: z.toJSONSchema(generatedTasksSchema)
      }
    });

    if (!res.text) throw new Error('Gemini returned an empty response');

    const { tasks } = generatedTasksSchema.parse(JSON.parse(res.text));

    if (tasks.length === 0) {
      throw new Error("The uploaded document doesn't look like an assignment brief");
    }

    // better-sqlite3 transactions must be synchronous
    db.transaction((tx) => {
      tx.insert(task)
        .values(
          tasks.map((t, position) => ({
            generationId,
            position,
            title: t.title,
            description: t.description || null
          }))
        )
        .run();

      tx.update(generation)
        .set({ status: 'completed' })
        .where(eq(generation.id, generationId))
        .run();

      tx.update(assignment)
        .set({ activeGenerationId: generationId })
        .where(eq(assignment.id, gen.assignmentId))
        .run();
    });
  } catch (error) {
    console.error(`Generation ${generationId} failed:`, error);
    await db
      .update(generation)
      .set({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      .where(eq(generation.id, generationId))
      .catch((e) => console.error(`Could not mark generation ${generationId} as failed:`, e));
  } finally {
    // push the completed/failed status to the owner's live getAssignments
    if (userId) notifyAssignmentsChanged(userId);
  }
}
