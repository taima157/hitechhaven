import database from "@/database";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    let error = false;

    let incompleteBody = false;

    if (!email) {
      incompleteBody = true;
    }

    if (!password) {
      incompleteBody = true;
    }

    if (incompleteBody) {
      return NextResponse.json(
        {
          message: "Incomplete data in the request body",
        },
        { status: 400 }
      );
    }

    try {
      const user: any = await database.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (user[0]) {
        const dbPass = user[0].password;
        const jwtSecret = process.env.JWT_TOKEN;

        if (bcrypt.compareSync(password, dbPass)) {
          const token = jwt.sign(
            {
              id_user: user.id_user,
            },
            jwtSecret ? jwtSecret : "",
            { expiresIn: "1h" }
          );

          return NextResponse.json(
            {
              message: "Successful login",
              token: token,
            },
            { status: 200 }
          );
        } else {
          error = true;
        }
      } else {
        error = true;
      }
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (error) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Incomplete data in the request body",
      },
      { status: 400 }
    );
  }
}
