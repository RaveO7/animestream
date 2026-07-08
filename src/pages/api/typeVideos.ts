import { NextApiRequest, NextApiResponse } from "next";
import { getTableName, validateTableName } from '@/lib/query-helpers';
import { getAnimeVideos, getTypeVideos } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = JSON.parse(req.body);
        const numberVideoByPage = parseInt(process.env.Number_Video!);
        const type = body.type || "studio";

        const posts = type === 'anime'
            ? await getAnimeVideos(body.name, body.order || "Latest", body.pageNbr, numberVideoByPage)
            : await getTypeVideos(
                validateTableName(getTableName(type)) as 'Channel' | 'Actor' | 'Categorie',
                body.name,
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
