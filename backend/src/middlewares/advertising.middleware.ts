// src/middlewares/advertising.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Type déclaré à part (plus sûr qu'un générique inline dans un "as ...")
type FieldErrors = Record<string, string[] | undefined>;

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const flattened = result.error.flatten();
      const fieldErrors = flattened.fieldErrors as FieldErrors;

      const parts: string[] = [];
      for (const field of Object.keys(fieldErrors)) {
        const errs = fieldErrors[field];
        if (errs && errs.length > 0) {
          parts.push(`${field} : ${errs.join(", ")}`);
        }
      }

      const message = parts.length > 0 ? parts.join(" — ") : "Données invalides";

      res.status(422).json({
        success: false,
        message,
        errors: fieldErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };