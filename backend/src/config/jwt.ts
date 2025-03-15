import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

export const generateToken = (id: number): string => {
    const token = jwt.sign({ id }, secret, { expiresIn: "1h"})
    return token;
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret);
};