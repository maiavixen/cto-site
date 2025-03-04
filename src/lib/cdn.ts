import axios from "axios";
import FormData from "form-data";

export interface CDNImageResponse {
    result: {
        id: string;
        filename: string;
        metadata: Record<string, string>;
        uploaded: string;
        requireSignedURLs: boolean;
        variants: string[];
    };
    success: boolean;
    errors: string[];
    messages: string[];
}

export class CDN {
    apiEndpoint: string;
    apiKey: string;

    constructor() {
        this.apiEndpoint = 'https://api.cloudflare.com/client/v4/accounts/1e80b8215a9c3f2386e05f27e84bfae4/images/v1';
        const apiKey = process.env.CLOUDFLARE_API_KEY;

        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.apiKey = apiKey;
    }

    async uploadImage(file: File): Promise<CDNImageResponse> {
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const form = new FormData();
        form.append("file", fileBuffer, file.name);

        // Prepare headers including form's headers
        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': file.type,
            ...form.getHeaders()
        };

        try {
            // Upload image to Cloudflare's CDN
            const response = await axios.post(this.apiEndpoint, form, { headers });
            if (!response.data.success) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data;
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error('Unknown error occurred while uploading image to CDN');
            }
        }
    }
}