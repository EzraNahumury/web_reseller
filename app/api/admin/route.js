import { NextResponse } from "next/server";
import { requestGoogleScript } from "@/lib/googleScriptServer";

export async function GET() {
  try {
    const result = await requestGoogleScript("admin-list", {
      service: "admin",
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengambil data admin.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await requestGoogleScript("admin-create", {
      service: "admin",
      method: "POST",
      body: payload,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menyimpan data admin.",
      },
      { status: 500 },
    );
  }
}
