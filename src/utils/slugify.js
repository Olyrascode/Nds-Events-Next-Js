// utils/slugify.js
export function slugify(text) {
  if (!text) return "";
  text = text.toString().toLowerCase().trim();

  // Transliteration pour les caractères accentués courants
  const from = "àáäâãåæçèéëêìíïîðñòóöôõøùúüûýþÿŕ";
  const to = "aaaaaaaceeeeiiiidnoooooouuuuythy";

  for (let i = 0, l = from.length; i < l; i++) {
    text = text.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  text = text
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^\w\-]+/g, "") // Supprime tous les caractères non-alphanumériques (sauf les tirets)
    .replace(/\-\-+/g, "-") // Remplace plusieurs tirets par un seul
    .replace(/^-+/, "") // Supprime les tirets en début de texte
    .replace(/-+$/, ""); // Supprime les tirets en fin de texte
  return text;
}
