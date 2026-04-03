"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";

type FormState = {
  child_name: string;
  birth_year: string;
  preferred_category: string;
  parent_name: string;
  phone: string;
  email: string;
  note: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const BIRTH_YEARS = Array.from({ length: 11 }, (_, i) => 2012 + i); // 2012–2022

function getCategoryForYear(year: number): string {
  if (year >= 2012 && year <= 2013) return "Dorost";
  if (year >= 2014 && year <= 2015) return "Žáci";
  if (year >= 2016 && year <= 2017) return "Mladší žáci";
  if (year >= 2018 && year <= 2019) return "Přípravka";
  if (year >= 2020 && year <= 2022) return "Školička";
  return "";
}

const inputClasses =
  "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--club-primary)] focus:outline-none transition-colors";

const errorInputClasses =
  "w-full bg-[var(--bg-surface)] border border-red-500 rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-red-400 focus:outline-none transition-colors";

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    child_name: "",
    birth_year: "",
    preferred_category: "",
    parent_name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-suggest category when birth_year changes
      if (field === "birth_year" && value) {
        const year = parseInt(value, 10);
        next.preferred_category = getCategoryForYear(year);
      }
      return next;
    });
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.child_name.trim()) newErrors.child_name = "Zadejte jméno dítěte";
    if (!form.birth_year) newErrors.birth_year = "Vyberte ročník narození";
    if (!form.parent_name.trim()) newErrors.parent_name = "Zadejte jméno rodiče";
    if (!form.phone.trim()) newErrors.phone = "Zadejte telefon";
    if (!form.email.trim()) {
      newErrors.email = "Zadejte email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Zadejte platný email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          birth_year: parseInt(form.birth_year, 10),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepodařilo se odeslat přihlášku");
      }

      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Neznámá chyba");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <p className="font-heading font-bold text-xl text-[var(--text-primary)]">
          Přihláška odeslána!
        </p>
        <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
          Děkujeme! Ozveme se vám do 3 dnů s informacemi o tréninku.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Child name */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Jméno a příjmení dítěte *
        </label>
        <input
          type="text"
          value={form.child_name}
          onChange={(e) => setField("child_name", e.target.value)}
          className={errors.child_name ? errorInputClasses : inputClasses}
          placeholder="Jan Novák"
        />
        {errors.child_name && (
          <p className="text-xs text-red-400 mt-1">{errors.child_name}</p>
        )}
      </div>

      {/* Birth year + Category — side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Ročník narození *
          </label>
          <select
            value={form.birth_year}
            onChange={(e) => setField("birth_year", e.target.value)}
            className={errors.birth_year ? errorInputClasses : inputClasses}
          >
            <option value="">Vyberte ročník</option>
            {BIRTH_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.birth_year && (
            <p className="text-xs text-red-400 mt-1">{errors.birth_year}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Preferovaná kategorie
          </label>
          <input
            type="text"
            value={form.preferred_category}
            onChange={(e) => setField("preferred_category", e.target.value)}
            className={inputClasses}
            placeholder="Automaticky dle ročníku"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Automaticky vyplněno, lze upravit
          </p>
        </div>
      </div>

      {/* Parent name */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Jméno rodiče / zákonného zástupce *
        </label>
        <input
          type="text"
          value={form.parent_name}
          onChange={(e) => setField("parent_name", e.target.value)}
          className={errors.parent_name ? errorInputClasses : inputClasses}
          placeholder="Marie Nováková"
        />
        {errors.parent_name && (
          <p className="text-xs text-red-400 mt-1">{errors.parent_name}</p>
        )}
      </div>

      {/* Phone + Email — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Telefon *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={errors.phone ? errorInputClasses : inputClasses}
            placeholder="+420 777 123 456"
          />
          {errors.phone && (
            <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className={errors.email ? errorInputClasses : inputClasses}
            placeholder="rodic@email.cz"
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Poznámka
        </label>
        <textarea
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          rows={4}
          className={inputClasses}
          placeholder="Např. má vaše dítě fotbalové zkušenosti?"
        />
      </div>

      {submitError && (
        <p className="text-sm text-red-400">{submitError}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? "Odesílám přihlášku..." : "Odeslat přihlášku"}
      </Button>

      <p className="text-xs text-[var(--text-muted)] text-center">
        * Povinné pole. Vaše osobní údaje zpracováváme v souladu s GDPR.
      </p>
    </form>
  );
}
