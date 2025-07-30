import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
