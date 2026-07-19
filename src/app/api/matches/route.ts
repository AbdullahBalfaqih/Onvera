import { NextResponse } from "next/server";
import { getMatches } from "@/lib/txline";

export async function GET(req: Request) {
  try {
    const token = req.headers.get('x-api-token');
    const matches = await getMatches(token || undefined);
    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
