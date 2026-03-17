import { NextResponse } from "next/server";
import { requestGoogleScript } from "@/lib/googleScriptServer";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await requestGoogleScript("edit", {
      method: "POST",
      body: payload,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal update data reseller.",
      },
      { status: 500 },
    );
  }
}
