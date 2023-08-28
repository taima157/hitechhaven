import { NextRequest, NextResponse } from "next/server";
import database from "@/database";
import authentication from "@/middlewares/authentication";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuthentication = authentication(req);

  if (!isAuthentication?.isAuthenticated) {
    return NextResponse.json(
      {
        message: isAuthentication?.message,
      },
      { status: 401 }
    );
  }

  try {
    const response: any = await database.query(
      "SELECT user_name, email FROM users WHERE id_user = ?",
      [params.id]
    );

    const user = await response[0];

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
