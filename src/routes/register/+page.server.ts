import { register } from '$lib/auth';
import prisma from '$lib/db';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formdata = await request.formData();

		const username = formdata.get('username') as string;
		const password = formdata.get('password') as string;
		const invitecode = formdata.get('invite-code') as string;
		const redirectTo = formdata.get('redirect-to') as string;

		if (!username || !password || !invitecode) {
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
		
		// Checks username and password are of valid length
		if (username.length < 3 || password.length < 8) {
			return fail(400, {
				message: 'Username must be at least 3 characters long, and password must be at least 8 characters long'
			});
		}

		// Check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: { username }
		});

		if (existingUser) {
			return fail(400, {
				message: 'Username already taken'
			});
		}

		// Check if invite code is correct
		if (invitecode !== env.INVITE) {
			return fail(400, {
				message: 'Invalid invite code'
			});
		}

		const newUser = await register({ username, password });

		if (newUser.success && newUser.session) {
			cookies.set('session', newUser.session, {
				path: '/',
				secure: true,
				httpOnly: true,
				sameSite: 'lax'
			});
			if (redirectTo) {
				return redirect(303, Buffer.from(redirectTo, 'base64url').toString());
			}
		}

		return redirect(303, '/');
	}
} satisfies Actions;
