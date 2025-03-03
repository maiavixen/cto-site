import { login } from "$lib/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formdata = await request.formData();
        const username = formdata.get('username') as string;
        const password = formdata.get('password') as string;
        const redirectTo = formdata.get('redirect-to') as string;

        // Ensure both fields are present
        if (!username || !password) {
            return fail(400, {
                message: 'Missing fields'
            });
        }

        // Prevent attempts at memory exhaustion or other attacks
        if (username.length > 32 || password.length > 32) {
            return fail(400, {
                message: 'Fields too long'
            });
        }

        // Attempt to log in
        const user = await login({ username, password });

        // If successful, set the session cookie and redirect to the home page
        if (user.success && user.session) {
            cookies.set('session', user.session, {
                path: '/',
				secure: true,
				httpOnly: true,
				sameSite: 'lax'
			});
            
            if (redirectTo) {
                return redirect(303, Buffer.from(redirectTo, 'base64url').toString());
            }
            
            return redirect(303, '/');
        } else {
            return fail(401, {
                message: 'Invalid credentials'
            });
        }
    }
} satisfies Actions;