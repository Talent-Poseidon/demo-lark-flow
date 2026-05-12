import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.standar.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/standar failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch standar" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobTitle, description } = body;

    if (!jobTitle || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.standar.create({
      data: { jobTitle, description },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/standar failed:", error);
    return NextResponse.json(
      { error: "Failed to create standar" },
      { status: 500 }
    );
  }
}
