import { NextApiRequest, NextApiResponse } from "next";
import { getDataVideo } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const dataId = parseInt(req.query.value as string);
        if (isNaN(dataId) || dataId <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        const posts = getDataVideo(dataId);
        if (!posts) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
