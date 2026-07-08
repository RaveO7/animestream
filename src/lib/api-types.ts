/**
 * Types TypeScript pour les résultats des requêtes API
 * Remplace les types 'any' pour améliorer la sécurité de type
 */

/**
 * Résultat d'une requête de vidéo (utilisé dans homeVideos.ts)
 */
export interface VideoResult {
    id: number;
    title: string;
    imgUrl: string;
    time: string;
    like: number;
    dislike: number;
    view: number;
    nbr: number; // Nombre total de pages
}

/**
 * Résultat d'une recherche de vidéo (utilisé dans searchVideos.ts pour type="videos")
 */
export interface SearchVideoResult {
    id: number;
    title: string;
    imgUrl: string;
    like: number;
    dislike: number;
    view: number;
    time: string;
    nbrPage: number; // Nombre total de pages
    nbr: number; // Nombre total de résultats
}

/**
 * Résultat d'une recherche de type (studios, characters, genres) dans searchVideos.ts
 */
export interface SearchTypeResult {
    name: string;
    imgUrl: string;
    nbrPage: number; // Nombre total de pages
    nbr: number; // Nombre total de résultats
}

/**
 * Résultat d'une requête de type (utilisé dans type.ts)
 */
export interface TypeResult {
    name: string;
    imgUrl: string;
    nbr: number; // Nombre de vidéos pour ce type
    nbrPages: number; // Nombre total de pages
    nbrTt: number; // Nombre total de types
}

/**
 * Résultat d'une requête de vidéos par type (utilisé dans typeVideos.ts)
 */
export interface TypeVideoResult {
    id: number;
    title: string;
    imgUrl: string;
    time: string;
    like: number;
    dislike: number;
    view: number;
    nbr: number; // Nombre total de vidéos
    page: number; // Nombre total de pages
}

