import { NextApiRequest, NextApiResponse } from "next";
import { incrementVal } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body);
        const id = parseInt(body.id);
        const cookie = body.cookie;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }

        if (!['l', 'd', 'r'].includes(cookie)) {
            return res.status(400).json({ error: 'Invalid cookie value' });
        }

        await incrementVal(id, cookie);
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
