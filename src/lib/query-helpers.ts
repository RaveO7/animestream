/**
 * Helpers pour les requêtes SQL - Logique de tri et conversion de types
 */

export type OrderType = "Latest" | "More View" | "Most Popular" | "A->Z" | "Z->A";

/**
 * Génère la clause ORDER BY pour les requêtes de vidéos
 * @param order - Type de tri demandé
 * @param useTablePrefix - Si true, utilise le préfixe de table (ex: "v.like" au lieu de "like")
 * @returns Clause SQL ORDER BY
 */
export function getOrderClauseForVideos(order: string, useTablePrefix: boolean = false): string {
    const prefix = useTablePrefix ? "v." : "";
    
    switch (order) {
        case "Latest":
            return `ORDER BY ${prefix}id DESC`;
        case "More View":
            return `ORDER BY ${prefix}view DESC`;
        case "Most Popular":
            return `ORDER BY ${prefix}like DESC`;
        case "A->Z":
            return `ORDER BY ${prefix}title ASC`;
        case "Z->A":
            return `ORDER BY ${prefix}title DESC`;
        default:
            return `ORDER BY ${prefix}id DESC`;
    }
}

/**
 * Génère la clause ORDER BY pour les requêtes de types (channels, actors, categories)
 * @param order - Type de tri demandé
 * @param useIdVideo - Si true, trie par idVideo (pour Latest), sinon par name
 * @returns Clause SQL ORDER BY
 */
export function getOrderClauseForTypes(order: string, useIdVideo: boolean = false): string {
    switch (order) {
        case "Latest":
            return useIdVideo ? "ORDER BY t.idVideo DESC" : "ORDER BY t.name ASC";
        case "A->Z":
            return "ORDER BY t.name ASC";
        case "Z->A":
            return "ORDER BY t.name DESC";
        default:
            return "ORDER BY t.name ASC";
    }
}

/**
 * Convertit le type de recherche en nom de table SQL
 * @param type - Type de recherche (studios, characters, genres, etc.)
 * @returns Nom de la table SQL correspondante
 */
export function getTableName(type: string): string {
    switch (type) {
        case "studios":
        case "studio":
            return "Channel";
        case "characters":
        case "character":
            return "Actor";
        case "genres":
        case "genre":
            return "Categorie";
        default:
            return "Channel";
    }
}

/**
 * Valide et retourne un nom de table SQL sécurisé
 * Utilisé pour éviter les injections SQL lors de l'utilisation de noms de tables dynamiques
 * @param tableName - Nom de table à valider
 * @returns Nom de table validé ou "Channel" par défaut
 */
export function validateTableName(tableName: string): string {
    const allowedTables = ["Channel", "Actor", "Categorie", "Videos"];
    return allowedTables.includes(tableName) ? tableName : "Channel";
}

/**
 * Calcule les paramètres de pagination pour les requêtes SQL
 * Évite la duplication de code dans les fichiers API
 * @param pageNbr - Numéro de page demandé (commence à 1)
 * @param numberVideoByPage - Nombre de vidéos par page
 * @returns Objet contenant pageNbr (0-indexed) et startSearchVideo (offset SQL)
 */
export function calculatePagination(pageNbr: number, numberVideoByPage: number): { pageNbr: number; startSearchVideo: number } {
    const normalizedPageNbr = pageNbr - 1 <= 0 ? 0 : pageNbr - 1;
    const startSearchVideo = normalizedPageNbr * numberVideoByPage;
    return { pageNbr: normalizedPageNbr, startSearchVideo };
}

