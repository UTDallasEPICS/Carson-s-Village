import { createAuthClient } from 'better-auth/vue';
import { inferAdditionalFields, emailOTPClient } from "better-auth/client/plugins";
import type { auth } from "~~/server/utils/auth";

export const authClient = createAuthClient({
  plugins: [
    // Ensure additional role field is visible to typescript
    inferAdditionalFields<typeof auth>(),

    emailOTPClient()
  ]
})
