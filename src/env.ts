import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: { description: 'The database connection string.' },
  ORIGIN: {
    description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
  },
  BETTER_AUTH_SECRET: {
    description:
      'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
  },
  UPLOAD_DIR: { description: 'The directory for file uploads' },
  GEMINI_API_KEY: { description: 'The api key for Gemini' },
  GEMINI_MODEL: { description: 'The model for the generation (default gemini-3.6-flash)' }
});
