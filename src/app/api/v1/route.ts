import { NextRequest, NextResponse } from "next/server";
import database from "../../../database";

export async function GET(req: NextRequest) {
  try {
    const response = await database.query("SELECT * FROM users");

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 404 });
  }
}
