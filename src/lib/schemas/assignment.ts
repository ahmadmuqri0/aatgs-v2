import z from 'zod';

import { MODEL_TIERS } from '#lib/models.ts';

export const MAX_DOCS_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${+mb.toFixed(1)} MB` : `${+(bytes / 1024).toFixed(1)} KB`;
}

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a title'),
  dueDate: z.union([z.iso.date(), z.literal('')]),
  model: z.enum(MODEL_TIERS, 'Please choose a model'),
  brief: z
    .instanceof(File, { message: 'Please upload the assignment brief' })
    .refine((file) => file.type === 'application/pdf', 'Only PDF files are accepted')
    .refine(
      (file) => file.size <= MAX_DOCS_SIZE,
      `File must be ${formatSize(MAX_DOCS_SIZE)} or smaller`
    )
});

export const updateAssignmentSchema = createAssignmentSchema
  .pick({ title: true, dueDate: true })
  .extend({ id: z.string().min(1) });
