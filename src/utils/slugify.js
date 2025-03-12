// utils/slugify.js
export function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // remplace les espaces par des tirets
      .replace(/[^\w\-]+/g, '')     // supprime les caractères non alphanumériques
      .replace(/\-\-+/g, '-');      // remplace plusieurs tirets par un seul
  }
  