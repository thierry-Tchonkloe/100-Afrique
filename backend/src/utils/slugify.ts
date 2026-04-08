import slugify from 'slugify';

/**
 * Génère un slug unique à partir d'un titre
 * @param text - Le texte à transformer en slug
 * @returns Un slug en minuscules, sans accents, avec des tirets
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'fr',
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Génère un slug unique en ajoutant un suffixe si nécessaire
 * @param baseSlug - Le slug de base
 * @param existingSlugs - Liste des slugs déjà existants
 * @returns Un slug unique
 */
export function makeUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}