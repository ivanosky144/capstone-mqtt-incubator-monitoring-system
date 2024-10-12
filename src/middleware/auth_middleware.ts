import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface IAuthMiddlewareRequest extends NextApiRequest {
    user: string | JwtPayload
}

const authMiddleware = (handler: NextApiHandler) => {
    return async (req: IAuthMiddlewareRequest, res: NextApiResponse) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }

            const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
            req.user = decoded;

            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

export default authMiddleware;
