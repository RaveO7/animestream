/**
 * Helpers pour les requêtes API - Types et fonctions utilitaires
 * Remplace les déclarations manuelles de postData: any pour améliorer la sécurité de type
 */

export interface ApiRequestData {
    method: "POST" | "GET" | "PUT" | "DELETE";
    headers: Record<string, string>;
    body?: string; // Optionnel car GET n'a pas de body
}

/**
 * Crée un objet de requête POST avec le body JSON stringifié
 * @param body - Objet à convertir en JSON pour le body
 * @returns Objet ApiRequestData configuré pour une requête POST
 */
export function createPostRequest(body: object): ApiRequestData {
    return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

/**
 * Crée un objet de requête GET
 * @returns Objet ApiRequestData configuré pour une requête GET
 */
export function createGetRequest(): ApiRequestData {
    return {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    };
}

