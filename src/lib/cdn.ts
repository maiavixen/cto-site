import Cloudflare from "cloudflare";
import { env } from "$env/dynamic/private";



export class CDN {
    apiEndpoint: string;
    apiKey: string;
    apiUserHash: string
    apiAccountID: string;
    cloudflare: Cloudflare;

    constructor() {
        const apiUserHash = env.CLOUDFLARE_ACCOUNT_HASH;

        if (!apiUserHash) {
            throw new Error('API user hash is required');
        }

        const apiAccountID = env.CLOUDFLARE_ACCOUNT_ID;

        if (!apiAccountID) {
            throw new Error('API account ID is required');
        }

        this.apiUserHash = apiUserHash;
        this.apiAccountID = apiAccountID;

        this.apiEndpoint = `https://api.cloudflare.com/client/v4/accounts/${apiUserHash}/images/v1`;

        const apiKey = env.CLOUDFLARE_API_KEY;

        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.apiKey = apiKey;
        this.cloudflare = new Cloudflare({apiToken: apiKey});
    }

    async uploadImage(file: File): Promise<Cloudflare.Images.V1.Image> {

        try {
            const response = await this.cloudflare.images.v1.create({account_id: this.apiAccountID, file: file});

            return response
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error('Unknown error occurred while uploading image to CDN');
            }
        }
    }

    async deleteImage(imageID: string): Promise<Cloudflare.Images.V1DeleteResponse> {
        try {
            const response = await this.cloudflare.images.v1.delete(imageID, {account_id: this.apiAccountID});

            return response;
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error('Unknown error occurred while deleting image from CDN');
            }
        }
    }
}