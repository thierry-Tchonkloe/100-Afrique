// src/middlewares/validate.ts
import type { Request, Response, NextFunction } from 'express';
import { type ZodTypeAny, ZodError } from 'zod';
import { errorResponse } from '../utils/response';

/**
 * Middleware de validation avec Zod
 * @param schema - Schéma Zod pour valider les données
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validation du body, query et params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        errorResponse(
          res,
          'Erreur de validation des données',
          400,
          formattedErrors
        );
        return; // ← Ajout du return
      }

      next(error);
    }
  };
};