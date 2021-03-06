import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "../config";

export const verifyJWtToken = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"]
});

export const verifyUnauthRequest = (err: any, req: any, res: any, next: any) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).send({error: 'Invalid auth token'});
    } else {
        next(err);
    }
}