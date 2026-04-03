import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Vyplňte prosím všechna povinná pole" },
        { status: 400 },
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Zadejte prosím platný email" },
        { status: 400 },
      );
    }

    // Log to admin_logs table
    const sb = createServerClient();
    await sb.from("admin_logs").insert({
      action: "contact_form",
      details: {
        name,
        email,
        subject: subject || "(bez předmětu)",
        message,
        submitted_at: new Date().toISOString(),
      },
    });

    // Also log to console for visibility
    console.log("[Contact Form]", { name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact Form Error]", err);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 },
    );
  }
}
