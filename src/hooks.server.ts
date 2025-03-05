import { validateAndGetSession } from "$lib/auth";
import { error, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handleAuth: Handle = async ({ event, resolve }) => {
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

export const handleMaxSize: Handle = async ({ event, resolve }) => {
    const defaultMaxBytesSize = 512 * 1024 // 512KB
    const maxUploadFileSize = 1024 * 1024 * 10 // 10MB

    const contentLength = +(event.request.headers.get('content-length') ?? 0);

    if (event.url.pathname === '/feed') {
        if (contentLength > maxUploadFileSize) {
            throw error(413, {
                message: 'Request entity too large'
            });
        }
        return resolve(event);
    }

    if (contentLength > defaultMaxBytesSize) {
        throw error(413, {
            message: 'Request entity too large'
        });
    }
    return resolve(event);
}

// this one is more for fun than anything, lots of bots will bruteforce URLs to find sensitive routes (like for example, for wordpress they try to find /wp-admin and enumerate plugins, etc)
export const minipot: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    if (response.status === 404) {
        console.log(`[minipot] - Catched 404 on "${event.request.url}"!`) // TODO: log this to a file or DB maybe :3c
    }

    return response;
}

export const handle = sequence(handleAuth, handleMaxSize, minipot);