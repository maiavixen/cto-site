import { validateAndGetSession } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Validate session cookie
    const session = event.cookies.get('session') as string;

    if (session) {
        const user = await validateAndGetSession(session);

        if (user) {
            event.locals.user = user;
        }

    }

    const response = await resolve(event);
    return response;
};