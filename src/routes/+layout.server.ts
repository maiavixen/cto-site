export async function load({ locals }) {
    return {
        id: locals.user ? locals.user.id : null,
        loggedIn: !!locals.user,
        username: locals.user ? locals.user.username : null,
    };
}