import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../../modules/auth/auth.utility';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Truy cập bị từ chối: Thiếu Access Token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    return;
  }

  req.user = decoded;
  next();
};