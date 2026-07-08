import { NextApiRequest, NextApiResponse } from "next";
import { searchVideos } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body);
        const numberVideoByPage = parseInt(process.env.Number_Video!);
        const search = body.search || "";
        let type = body.type || "videos";

        if (!["videos", "animes", "studios", "genres"].includes(type)) {
            type = "videos";
        }

        const posts = await searchVideos(
            search,
            type as 'videos' | 'animes' | 'studios' | 'genres',
            body.order || "Latest",
            body.pageNbr,
            numberVideoByPage
        );

        res.json(posts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
