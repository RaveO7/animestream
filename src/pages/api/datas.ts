import { NextApiRequest, NextApiResponse } from "next";
import { validateTableName } from '@/lib/query-helpers';
import { ensureVideoStoreLoaded, getTableNames } from '@/lib/data/video-store';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        await ensureVideoStoreLoaded();
        const tableName = req.query.value as string;
        const validatedTable = validateTableName(tableName || "") as 'Channel' | 'Actor' | 'Categorie';
        const posts = getTableNames(validatedTable);
        res.json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
