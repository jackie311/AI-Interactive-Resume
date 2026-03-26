import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function GET() {
  const res = await fetch(`${API_BASE}/resume/download`, { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json({ error: "PDF not available" }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Jackie_Jin_Resume.pdf"',
    },
  });
}
