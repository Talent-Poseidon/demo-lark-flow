import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/notifications failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, assesseeName, assesseeEmail, message } = body;

    if (!projectId || !assesseeName || !assesseeEmail || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 400 }
      );
    }

    const item = await prisma.notification.create({
      data: { projectId, assesseeName, assesseeEmail, message },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/notifications failed:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
