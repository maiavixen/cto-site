import { CDN } from "$lib/cdn";
import prisma, { createPost } from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    let loggedIn = false;
    let id;
    let username;
    let userID;

    if (locals.user) {
        id = locals.user.id;
        loggedIn = true;
        username = locals.user.username;
        userID = locals.user.id;
    }
    
    // Fetch posts
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            },
            image: {
                select: {
                    url: true,
                    thumbnail: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        },
    });

    return {
        id,
        loggedIn,
        posts,
        userID,
        username,
    };
}

export const actions = {
    post: async({request, locals}) => {
        if (!locals.user) {
            return error(401, {
                message: 'Unauthorized'
            });
        }

        const formdata = await request.formData();

        const location = formdata.get('location') as string;
        const date = formdata.get('date') as string;
        const time = formdata.get('time') as string;
        const bird = formdata.get('bird') as string;
        const activity = formdata.get('activity') as string;
        const duration = Number(formdata.get('duration'));
        const comments = formdata.get('comments') as string;
        const imageFile = formdata.get('image') as File;

        // Validate input
        if (!location || !date || !time || !bird || !activity || !duration || !imageFile) {
            return error(400, {
                message: 'All fields are required'
            });
        }

        // Prevent attempts at memory exhaustion or other attacks here as well
        if (location.length > 64 || bird.length > 64 || activity.length > 64 || comments.length > 256) {
            return error(400, {
                message: 'Fields too long'
            });
        }

        // Set a limit of 10MB for the image
        if (imageFile.size > 10 * 1024 * 1024) {
            return error(400, {
                message: 'Image size must be less than 10MB'
            });
        }

        const cdn = new CDN();
        let image;
        try {
            image = await cdn.uploadImage(imageFile);
        } catch (err) {
            return error(500, {
                message: err instanceof Error ? err.message : 'Unknown error occurred'
            });
        }

        if (!image || !image.id) {
            return error(500, {
                message: 'Unknown error occurred'
            });
        }

        // Create date object from date and time
        const datetime = new Date(`${date}T${time}`);

        try {
            // Save data to database
            await createPost(
                location,
                datetime,
                bird,
                comments,
                activity,
                image.id,
                duration,
                locals.user.id
            );
            
        } catch (err) {
            console.error(err);
            return error(500, {
                message: err instanceof Error ? err.message : 'Unknown error occurred'
            });
        }


        return { status: 200 }
    },
    edit: async ({ request, locals }) => {
        if (!locals.user) {
            return error(401, {
                message: 'Unauthorized'
            });
        }

        const formdata = await request.formData();
        const postId = formdata.get('postid') as string;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true }
        });

        if (!post || post.authorId !== locals.user.id) {
            return error(403, {
                message: 'Forbidden'
            });
        }

        const location = formdata.get('location') as string;
        const date = formdata.get('date') as string;
        const time = formdata.get('time') as string;
        const bird = formdata.get('bird') as string;
        const activity = formdata.get('activity') as string;
        const duration = Number(formdata.get('duration'));
        const comments = formdata.get('comments') as string;

        // Create date object from date and time
        const datetime = new Date(`${date}T${time}`);

        await prisma.post.update({
            where: { id: postId },
            data: {
                location,
                dateTimeOfObservation: datetime,
                bird,
                comment: comments,
                activity,
                duration
            }
        });

        return { status: 200 }
    },
    delete: async ({ request, locals }) => {
        if (!locals.user) {
            return error(401, {
                message: 'Unauthorized'
            });
        }

        const formdata = await request.formData();
        const postId = formdata.get('postid') as string;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true, image: { select: { id: true } } }
        });

        if (!post || post.authorId !== locals.user.id) {
            return error(403, {
                message: 'Forbidden'
            });
        }

        const cdn = new CDN();
        await cdn.deleteImage(post.image.id);

        try {
            await prisma.post.delete({
                where: { id: postId }
            });
        } catch (err) {
            console.error(err);
            return error(500, {
                message: err instanceof Error ? err.message : 'Unknown error occurred'
            });
        }

        return { status: 200 }
    }
};