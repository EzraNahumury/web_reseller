import { NextResponse } from "next/server";
import { requestGoogleScript } from "@/lib/googleScriptServer";

export async function GET() {
  try {
    const result = await requestGoogleScript("resellers");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengambil data reseller.",
      },
      { status: 500 },
    );
  }
}
