import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.domainEvent.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/domain-events failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch domain events" },
      { status: 500 }
    );
  }
}
