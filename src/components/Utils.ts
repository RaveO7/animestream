export function upperFirstLetter(str: string) {
  if (str == undefined) return str
  return str
    .toLowerCase()
    .replace('-', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getRating(like: number, dislike: number) { return ((100 * like) / (like + dislike)) ? Math.round((100 * like) / (like + dislike)) : 0; }

export default function TimeDifference({ date }: any) {
  const now: any = new Date()
  const dateTime: any = new Date(date)

  const seconds: any = (now - dateTime) / 1000;
  const minutes: any = seconds / 60;
  const hours: any = minutes / 60;
  const days: any = hours / 24;
  const week: any = days / 7;
  const months: any = week / 4;
  const years: any = days / 365.24;

  if (years >= 1) {
    let result = `${parseInt(years)} an${years !== 1 ? 's' : ''}`;
    const remainingMonths: any = months % 12;

    if (remainingMonths >= 1) { result += ` ${parseInt(remainingMonths)} mois`; }

    return result;
  } else if (months >= 1) {
    return `${parseInt(months)} mois`;
  } else if (week >= 1) {
    return `${parseInt(week)} semaine${week !== 1 ? 's' : ''}`;
  } else if (days >= 1) {
    return `${parseInt(days)} jour${days !== 1 ? 's' : ''}`;
  } else if (hours >= 1) {
    return `${parseInt(hours)} heure${hours !== 1 ? 's' : ''}`;
  } else if (minutes >= 1) {
    return `${parseInt(minutes)} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${parseInt(seconds)} seconde${seconds !== 1 ? 's' : ''}`;
  }
};

export function setCookie(name: string | number, value: any, days: number, path: string) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
}

export function getCookie(name: string | number) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string, path: string) {
  if (getCookie(name)) { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};` }
}

export function formatString(str: string) {
  return str.replace(/([a-z\W])([A-Z])|([a-z])(\d)|(\d{2,})([A-Z])|(\d)([A-Z])|(\d)([A-Z]{2})/g, (match, avantMajusculeSpecial, majuscule1, minuscule2, chiffre, chiffres, majuscule2, chiffreAlone, deuxMajuscules) => {
    if (avantMajusculeSpecial && majuscule1) {
      // Ajoute un espace entre un caractère spécial ou une minuscule et une majuscule
      return `${avantMajusculeSpecial} ${majuscule1}`;
    } else if (minuscule2 && chiffre) {
      // Ajoute un espace entre une minuscule et un chiffre
      return `${minuscule2} ${chiffre}`;
    } else if (chiffres && majuscule2) {
      // Ajoute un espace entre plusieurs chiffres et une majuscule
      return `${chiffres} ${majuscule2}`;
    } else if (chiffreAlone && deuxMajuscules) {
      // Ajoute un espace entre un chiffre seul et deux majuscules
      return `${chiffreAlone}${deuxMajuscules} `;
    } else {
      return match; // Aucun espace ajouté
    }
  });
}

/**
 * Normalise une URL en enlevant le slash final de l'URL de base et en ajoutant le chemin correctement
 * @param baseUrl - L'URL de base (peut se terminer par / ou non)
 * @param path - Le chemin à ajouter (peut commencer par / ou non)
 * @returns L'URL normalisée sans double slash
 */
export function normalizeUrl(baseUrl: string, path: string = ''): string {
  // Enlève le slash final de l'URL de base s'il existe
  const cleanBase = baseUrl.replace(/\/+$/, '');
  
  // Si le chemin est vide, retourne juste l'URL de base nettoyée
  if (!path) {
    return cleanBase;
  }
  
  // Enlève les slashes au début du chemin et les ajoute correctement
  const cleanPath = path.replace(/^\/+/, '');
  
  // Combine l'URL de base et le chemin avec un seul slash
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

