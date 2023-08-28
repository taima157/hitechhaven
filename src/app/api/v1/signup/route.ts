import { NextRequest, NextResponse } from "next/server";
import database from "@/database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { user_name, email, password } = await req.json();

    let incompleteBody = false;

    if (!user_name) {
      incompleteBody = true;
    }

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
    } else {
      try {
        const user: any = await database.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (user[0]) {
          return NextResponse.json(
            { message: "User already registered with this email" },
            { status: 409 }
          );
        }

        const id_user = uuidv4();

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        await database.query(
          "INSERT INTO users (id_user, user_name, email, password, type) VALUES (?, ?, ?, ?, 'user')",
          [id_user, user_name, email, hash]
        );

        return NextResponse.json(
          { message: "Successfully registered user" },
          { status: 201 }
        );
      } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Incomplete data in the request body",
      },
      { status: 400 }
    );
  }
}
