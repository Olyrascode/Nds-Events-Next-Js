// import { useState, useEffect } from "react";
// import OptionsManager from "./OptionsManager";
// import ImageUpload from "../common/ImageUpload/ImageUpload";
// import { slugify } from "@/utils/slugify";

// // Optionnel : si on vient de créer une nouvelle catégorie, l'ajouter dans la liste (et l'envoyer au backend)
// if (creatingNewCategory && newCategory) {
//   const slugifiedCategory = slugify(newCategory);
//   fetch(
//     `${
//       process.env.NEXT_PUBLIC_API_URL || "https://82.29.170.25"
//     }/api/categories`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: newCategory, slug: slugifiedCategory }),
//     }
//   )
//     .then((res) => res.json())
//     .then((cat) => {
//       setCategories((prev) => [...prev, cat]);
//     })
//     .catch((err) => console.error(err));
// }
