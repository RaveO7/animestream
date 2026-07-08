import { NextApiRequest, NextApiResponse } from "next";
import { getHomeVideos } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const numberVideoByPage = parseInt(process.env.Number_Video!);
        const posts = getHomeVideos(body.order || "Latest", body.pageNbr, numberVideoByPage);
        res.json(posts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
