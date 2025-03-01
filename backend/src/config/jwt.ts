import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

export const generateToken = (id: number): string => {
    return jwt.sign({ id }, secret, { expiresIn: "1h"});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret);
};