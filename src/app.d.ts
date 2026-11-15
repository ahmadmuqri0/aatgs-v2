import type { User, Session } from 'better-auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user?: User;
      session?: Session;
    }
    interface PageData {
      title?: string;
      breadcrumbs?: { label: string; href?: import('$app/types').Path }[];
    }

    // interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
