import { NextApiRequest, NextApiResponse } from "next";
import { getTableName, validateTableName } from '@/lib/query-helpers';
import { ensureVideoStoreLoaded, getAnimes, getTypes } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        await ensureVideoStoreLoaded();
        const body = JSON.parse(req.body);
        const numberVideoByPage = parseInt(process.env.Number_Video!);
        const type = body.type || "studios";

        const posts = type === 'animes'
            ? getAnimes(body.order || "A->Z", body.pageNbr, numberVideoByPage)
            : getTypes(
                validateTableName(getTableName(type)) as 'Channel' | 'Actor' | 'Categorie',
                body.order || "A->Z",
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
