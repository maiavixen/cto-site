import prisma from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export function GET({cookies, locals}) {
    if (!locals.user) {
        return redirect(303, '/');
    }

    prisma.user.update({
        where: { id: locals.user.id },
        data: { session: null }
    });
 
    cookies.delete('session', {path: '/'});

    locals.user = null;

    return redirect(303, '/');
}