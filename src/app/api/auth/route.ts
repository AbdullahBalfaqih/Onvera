import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { passport: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          passport: {
            create: {
              favoriteTeam: "To be selected",
            },
          },
        },
        include: { passport: true },
      });
    } else if (!user.passport) {
      // Create passport if user exists but has no passport (shouldn't happen, but just in case)
      await prisma.fanPassport.create({
        data: {
          userId: user.id,
          favoriteTeam: "To be selected",
        },
      });
      user = await prisma.user.findUnique({
        where: { walletAddress },
        include: { passport: true },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
