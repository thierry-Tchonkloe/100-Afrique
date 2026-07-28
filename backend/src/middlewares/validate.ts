// src/middlewares/validate.ts
import type { Request, Response, NextFunction } from 'express';
import { type ZodTypeAny } from 'zod';

/**
 * FIX (dette technique connue) : la version précédente faisait
 * `await schema.parseAsync(...)` sans jamais réassigner le résultat à
 * `req.body` / `req.query` / `req.params`. Conséquence : les `.default()`
 * et les `.transform()` définis dans les schémas Zod n'avaient AUCUN
 * effet en pratique, le contrôleur recevait toujours les données brutes.
 *
 * Ici, on réassigne explicitement chaque partie APRÈS parsing, donc les
 * valeurs par défaut et transformations s'appliquent réellement.
 *
 * FIX 2 (celui-ci) : `req.query = ...` plantait avec
 * `TypeError: Cannot set property query of #<IncomingMessage> which has
 * only a getter`. Sur les versions récentes d'Express (5.x) / Node,
 * `req.query` est un getter calculé dynamiquement à partir de l'URL —
 * il n'a plus de setter, la réassignation directe de la référence est
 * donc impossible. `req.body` et `req.params` restent de simples
 * propriétés mutables (le bug ne les concerne pas), donc ils continuent
 * à être réassignés normalement. Pour `query` uniquement, on mute
 * l'objet existant EN PLACE : on vide ses clés actuelles puis on copie
 * dedans les valeurs validées/transformées par Zod. Le contrôleur en
 * aval, qui lit `req.query.xxx`, voit exactement les mêmes valeurs
 * qu'avec une réassignation — seule la référence de l'objet ne change
 * pas, ce qui est justement ce qu'exige ce getter.
 *
 * Usage dans une route :
 *   router.post('/x', validate(createXSchema), createX)
 * où createXSchema = z.object({ body: z.object({...}), query: z.object({...}).optional(), params: z.object({...}).optional() })
 */
interface ParsedRequestParts {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

/**
 * Remplace le contenu d'un objet EN PLACE (même référence), sans jamais
 * réassigner la propriété qui le contient. Nécessaire pour `req.query`
 * qui n'accepte plus de réassignation directe.
 */
function replaceObjectContentsInPlace(target: Record<string, unknown>, next: unknown): void {
  if (!next || typeof next !== 'object') return;

  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, next as Record<string, unknown>);
}

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Cast explicite : selon la version de zod, ZodTypeAny peut inférer
      // un output `unknown` plutôt que `any`, ce qui fait échouer l'accès
      // à `.body` / `.query` / `.params` en TS ("is of type unknown").
      // On sait que nos schémas renvoient toujours cette forme (voir les
      // fichiers validators/emploi/*.validator.ts), d'où ce cast ciblé.
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as ParsedRequestParts;

      if (parsed.body !== undefined) {
        // req.body reste une propriété normalement réassignable.
        req.body = parsed.body;
      }

      if (parsed.query !== undefined) {
        // FIX : mutation en place — voir le commentaire de fonction
        // ci-dessus. `req.query = ...` casserait avec
        // "Cannot set property query of #<IncomingMessage> which has
        // only a getter" sur les versions actuelles d'Express/Node.
        replaceObjectContentsInPlace(req.query as Record<string, unknown>, parsed.query);
      }

      if (parsed.params !== undefined) {
        // req.params reste une propriété normalement réassignable.
        req.params = parsed.params as any;
      }

      next();
    } catch (error) {
      // On laisse remonter au errorHandler central : c'est lui qui sait
      // formatter une ZodError en réponse 400 descriptive (voir
      // middlewares/errorHandler.ts). Pas de gestion locale ici : une
      // seule source de vérité pour le format d'erreur de validation.
      next(error);
    }
  };
};
