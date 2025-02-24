import { CDN } from "$lib/cdn";
import prisma, { createPost } from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Post } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
    interface LoadData {
        id?: string;
        loggedIn: boolean;
        username?: string;
        userID?: string;
        posts: Post[];
    }

    const data: LoadData = { loggedIn: false, posts: [] };

    if (locals.user) {
        data.id = locals.user.id;
        data.loggedIn = true;
        data.username = locals.user.username;
        data.userID = locals.user.id;
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
    data.posts = posts;

    return data;
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

        // Create date object from date and time
        const datetime = new Date(`${date}T${time}`);

        // Save data to database
        await createPost(
            location,
            datetime,
            bird,
            comments,
            activity,
            image.result.id,
            duration,
            locals.user.id
        );
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
            include: { author: true }
        });

        if (!post || post.authorId !== locals.user.id) {
            return error(403, {
                message: 'Forbidden'
            });
        }

        await prisma.post.delete({
            where: { id: postId }
        });
    }
};