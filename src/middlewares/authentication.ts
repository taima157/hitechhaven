import { NextRequest } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export default function authentication(req: NextRequest): {
  isAuthenticated: boolean;
  message?: string;
} {
  try {
    const token = headers().get("authorization");
    const jwtSecret = process.env.JWT_TOKEN;

    if (token) {
      let responseToken: any;

      jwt.verify(token, jwtSecret ? jwtSecret : "", (error, decode) => {
        if (error) {
          responseToken = {
            isAuthenticated: false,
            message: error.message,
          };
        } else {
          responseToken = {
            isAuthenticated: true,
          };
        }
      });

      return responseToken;
    } else {
      return {
        isAuthenticated: false,
        message: "You do not have authorization to perform this action.",
      };
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      message: "You do not have authorization to perform this action.",
    };
  }
}
