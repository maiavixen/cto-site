export async function load({ locals }) {
    let data = {}

    if (locals.user) {
        data = {
            id: locals.user.id,
            loggedIn: true,
            username: locals.user.username,
            ...data
        }
    }

    return data;
}