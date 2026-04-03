import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { child_name, birth_year, preferred_category, parent_name, phone, email, note } = body;

    // Validate required fields
    if (!child_name || !birth_year || !parent_name || !phone || !email) {
      return NextResponse.json(
        { error: "Vyplňte prosím všechna povinná pole" },
        { status: 400 },
      );
    }

    // Validate birth_year range
    const yearNum = Number(birth_year);
    if (!Number.isInteger(yearNum) || yearNum < 2012 || yearNum > 2022) {
      return NextResponse.json(
        { error: "Neplatný ročník narození (2012–2022)" },
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

    const sb = createServerClient();

    const { error: dbError } = await sb.from("youth_registrations").insert({
      child_name: child_name.trim(),
      birth_year: yearNum,
      preferred_category: preferred_category?.trim() || null,
      parent_name: parent_name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      note: note?.trim() || null,
      submitted_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("[Registration] DB error:", dbError);
      return NextResponse.json(
        { error: "Nepodařilo se uložit přihlášku. Zkuste to prosím znovu." },
        { status: 500 },
      );
    }

    console.log("[Registration] New registration:", { child_name, birth_year: yearNum, parent_name, email });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Registration Error]", err);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 },
    );
  }
}
