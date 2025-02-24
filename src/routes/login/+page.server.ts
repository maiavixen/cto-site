import { login } from "$lib/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formdata = await request.formData();
        const username = formdata.get('username') as string;
        const password = formdata.get('password') as string;

        if (!username || !password) {
            return fail(400, {
                message: 'Missing fields'
            });
        }

        const user = await login({ username, password });

        if (user.success && user.session) {
            cookies.set('session', user.session, {
                path: '/',
				secure: true,
				httpOnly: true,
				sameSite: 'lax'
			});
            return redirect(303, '/');
        } else {
            return fail(401, {
                message: 'Invalid credentials'
            });
        }
    }
} satisfies Actions;