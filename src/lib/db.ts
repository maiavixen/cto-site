import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prisma = new PrismaClient();

export async function createPost(
location: string, dateTimeOfObservation: Date, bird: string, comment: string, activity: string, imageID: string, duration: number, authorId: string) {
    const author = await prisma.user.findUnique({
        where: { id: authorId },
    });

    if (!author) {
        throw new Error('Author not found');
    }

    if (!imageID) {
        throw new Error('Image is required');
    }

    const cdnAccountHash = env.CLOUDFLARE_ACCOUNT_HASH;

    const imageDeliveryURL = `https://imagedelivery.net/${cdnAccountHash}/`;
    const imageURL = `${imageDeliveryURL}${imageID}/public`;
    const thumbnailURL = `${imageDeliveryURL}${imageID}/thumbnail`;

    return prisma.post.create({
        data: {
            location,
            dateTimeOfObservation,
            bird,
            comment,
            duration,
            activity,
            image: {
                create: {
                    url: imageURL,
                    thumbnail: thumbnailURL,
                }
            },
            author: {
                connect: {
                    id: authorId,
                }
            }
        }
    });
}

export default prisma;