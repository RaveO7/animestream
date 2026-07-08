import { NextApiRequest, NextApiResponse } from "next";
import { incrementView } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body);
        const id = parseInt(body.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        await incrementView(id);
        res.json(true);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
