import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schemaShape = (schema as any).shape || {};
      const isWrappedSchema = 'body' in schemaShape || 'query' in schemaShape || 'params' in schemaShape;

      if (isWrappedSchema) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        await schema.parseAsync(req.body);
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        res.status(400).json({
          success: false,
          message: 'Dữ liệu đầu vào không hợp lệ',
          errors: zodError.issues.map((e) => ({ 
            field: e.path.join('.'), 
            message: e.message 
          })),
        });
        return;
      }
      next(error);
    }
  };