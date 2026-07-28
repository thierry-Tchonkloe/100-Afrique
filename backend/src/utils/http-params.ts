// src/utils/http-params.ts
//
// Sous Express 5, `req.params.x` est typé `string | string[]` (les routes
// à segments répétés type `/foo/:id+` peuvent produire un tableau). Nos
// routes n'utilisent jamais ce genre de pattern, mais le typage reste
// large. Ce helper centralise l'extraction d'une valeur `string` sûre,
// plutôt que de caster `as string` un peu partout (ce qui masquerait
// silencieusement un vrai tableau si un jour une route évolue).
export function paramAsString(value: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}