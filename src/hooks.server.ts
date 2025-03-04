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
    const defaultMaxBytesSize = 512 * 1000 // 512KB
    const maxUploadFileSize = 10 * 1000 * 1000 // 10MB

    const contentLength = +(event.request.headers.get('content-length') ?? 0);

    console.log(event.url.pathname);
    
    if (event.url.pathname === '/feed') {
        if (contentLength > maxUploadFileSize) {
            return error(413, {
                message: 'Request entity too large'
            });
        }
        return resolve(event);
    }

    if (contentLength > defaultMaxBytesSize) {
        return error(413, {
            message: 'Request entity too large'
        });
    }
    return resolve(event);
}

export const handle = sequence(handleAuth, handleMaxSize);