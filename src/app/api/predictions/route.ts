import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, matchId, predictedWinner } = body;

    if (!userId || !matchId || !predictedWinner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prediction = await prisma.prediction.create({
      data: {
        userId,
        matchId,
        predictedWinner,
      },
    });

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const predictions = await prisma.prediction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
