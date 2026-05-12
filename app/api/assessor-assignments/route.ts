import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.assessorAssignment.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/assessor-assignments failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessor assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, assessorName, assessorEmail } = body;

    if (!projectId || !assessorName || !assessorEmail) {
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

    const item = await prisma.assessorAssignment.create({
      data: { projectId, assessorName, assessorEmail },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/assessor-assignments failed:", error);
    return NextResponse.json(
      { error: "Failed to create assessor assignment" },
      { status: 500 }
    );
  }
}
