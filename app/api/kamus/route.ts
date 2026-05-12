import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.kamus.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/kamus failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch kamus" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateName, fileName } = body;

    if (!templateName || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.kamus.create({
      data: { templateName, fileName },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/kamus failed:", error);
    return NextResponse.json(
      { error: "Failed to create kamus" },
      { status: 500 }
    );
  }
}
