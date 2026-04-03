'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import {
  RefreshCw,
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  CheckCircle,
} from 'lucide-react'

interface ClubSettings {
  id: string
  club_name: string
  motto: string
  tagline: string
  address: string
  phone: string
  email: string
  facebook_url: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  hero_image_url: string | null
}

interface Sponsor {
  id: string
  name: string
  tier: string
  website_url: string | null
  logo_url: string | null
  created_at: string
}

const TIER_LABELS: Record<string, string> = {
  main: 'Hlavni',
  partner: 'Partner',
  supporter: 'Supporter',
}

const DEFAULT_SETTINGS: Omit<ClubSettings, 'id'> = {
  club_name: '',
  motto: '',
  tagline: '',
  address: '',
  phone: '',
  email: '',
  facebook_url: '',
  logo_url: null,
  primary_color: '#6B21A8',
  secondary_color: '#7C3AED',
  accent_color: '#A855F7',
  hero_image_url: null,
}

export default function AdminNastaveniPage() {
  const supabase = getSupabaseBrowser()

  // Settings state
  const [settings, setSettings] = useState<ClubSettings | null>(null)
  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)

  // Sponsors state
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loadingSponsors, setLoadingSponsors] = useState(true)
  const [showSponsorForm, setShowSponsorForm] = useState(false)
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null)
  const [sponsorName, setSponsorName] = useState('')
  const [sponsorTier, setSponsorTier] = useState('partner')
  const [sponsorWebsite, setSponsorWebsite] = useState('')
  const [sponsorLogo, setSponsorLogo] = useState<string | null>(null)
  const [uploadingSponsorLogo, setUploadingSponsorLogo] = useState(false)
  const [savingSponsor, setSavingSponsor] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchSponsors()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    const { data } = await supabase
      .from('club_settings')
      .select('*')
      .single()

    if (data) {
      setSettings(data)
      setForm({
        club_name: data.club_name || '',
        motto: data.motto || '',
        tagline: data.tagline || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        facebook_url: data.facebook_url || '',
        logo_url: data.logo_url || null,
        primary_color: data.primary_color || '#6B21A8',
        secondary_color: data.secondary_color || '#7C3AED',
        accent_color: data.accent_color || '#A855F7',
        hero_image_url: data.hero_image_url || null,
      })
    }
    setLoading(false)
  }

  async function handleCreateSettings() {
    setSaving(true)
    const { data, error } = await supabase
      .from('club_settings')
      .insert({ ...form })
      .select()
      .single()

    if (data) {
      setSettings(data)
      setMessage('Nastaveni vytvoreno')
    }
    if (error) setMessage(`Chyba: ${error.message}`)
    setSaving(false)
  }

  async function handleSaveSettings() {
    if (!settings) return
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('club_settings')
      .update({ ...form })
      .eq('id', settings.id)

    if (error) {
      setMessage(`Chyba: ${error.message}`)
    } else {
      setMessage('Nastaveni ulozeno')
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  async function uploadImage(
    file: File,
    bucket: string,
    prefix: string
  ): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `${prefix}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) return null

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const url = await uploadImage(file, 'club-media', 'logos')
    if (url) setForm((prev) => ({ ...prev, logo_url: url }))
    setUploadingLogo(false)
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)
    const url = await uploadImage(file, 'club-media', 'hero')
    if (url) setForm((prev) => ({ ...prev, hero_image_url: url }))
    setUploadingHero(false)
  }

  // --- Sponsors ---
  async function fetchSponsors() {
    setLoadingSponsors(true)
    const { data } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: true })
    setSponsors(data || [])
    setLoadingSponsors(false)
  }

  function resetSponsorForm() {
    setSponsorName('')
    setSponsorTier('partner')
    setSponsorWebsite('')
    setSponsorLogo(null)
    setEditingSponsorId(null)
    setShowSponsorForm(false)
  }

  function startEditSponsor(s: Sponsor) {
    setEditingSponsorId(s.id)
    setSponsorName(s.name)
    setSponsorTier(s.tier)
    setSponsorWebsite(s.website_url || '')
    setSponsorLogo(s.logo_url)
    setShowSponsorForm(true)
  }

  async function handleSponsorLogoUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingSponsorLogo(true)
    const url = await uploadImage(file, 'club-media', 'sponsors')
    if (url) setSponsorLogo(url)
    setUploadingSponsorLogo(false)
  }

  async function handleSaveSponsor() {
    if (!sponsorName) return
    setSavingSponsor(true)

    const payload = {
      name: sponsorName,
      tier: sponsorTier,
      website_url: sponsorWebsite || null,
      logo_url: sponsorLogo,
    }

    if (editingSponsorId) {
      await supabase.from('sponsors').update(payload).eq('id', editingSponsorId)
    } else {
      await supabase.from('sponsors').insert(payload)
    }

    resetSponsorForm()
    await fetchSponsors()
    setSavingSponsor(false)
  }

  async function deleteSponsor(id: string) {
    if (!confirm('Opravdu smazat sponzora?')) return
    await supabase.from('sponsors').delete().eq('id', id)
    fetchSponsors()
  }

  function updateForm(key: keyof typeof form, value: string | null) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  // No settings row yet
  if (!settings) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading font-bold text-lg text-gray-900">
          Nastaveni
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Nastaveni zatim nejsou ulozena
          </p>
          <button
            onClick={handleCreateSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Vytvorit nastaveni
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-gray-900">
          Nastaveni klubu
        </h2>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Ulozit nastaveni
        </button>
      </div>

      {message && (
        <div
          className={`text-sm rounded-lg px-4 py-3 flex items-center gap-2 ${
            message.includes('Chyba')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {!message.includes('Chyba') && (
            <CheckCircle className="h-4 w-4 shrink-0" />
          )}
          {message}
        </div>
      )}

      {/* Zakladni info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Zakladni info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nazev klubu
            </label>
            <input
              type="text"
              value={form.club_name}
              onChange={(e) => updateForm('club_name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="SK Slovan Kunratice"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Motto
            </label>
            <input
              type="text"
              value={form.motto}
              onChange={(e) => updateForm('motto', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Motto klubu"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateForm('tagline', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Kratky popisek klubu"
            />
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Kontakt
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Adresa
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateForm('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Ulice, Mesto, PSC"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Telefon
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="+420 ..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="info@kunratice.cz"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={form.facebook_url}
              onChange={(e) => updateForm('facebook_url', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Branding
        </h3>

        {/* Logo */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Logo
          </label>
          <div className="flex items-center gap-4">
            {form.logo_url && (
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={form.logo_url}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
              />
              {uploadingLogo && (
                <p className="text-xs text-gray-400 mt-1">Nahravam...</p>
              )}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Primarni barva
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.primary_color}
                onChange={(e) => updateForm('primary_color', e.target.value)}
                className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={form.primary_color}
                onChange={(e) => updateForm('primary_color', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Sekundarni barva
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.secondary_color}
                onChange={(e) => updateForm('secondary_color', e.target.value)}
                className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={form.secondary_color}
                onChange={(e) => updateForm('secondary_color', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Akcentova barva
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => updateForm('accent_color', e.target.value)}
                className="h-9 w-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={form.accent_color}
                onChange={(e) => updateForm('accent_color', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Hero
        </h3>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Hero pozadi
          </label>
          {form.hero_image_url && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-200">
              <Image
                src={form.hero_image_url}
                alt="Hero background"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleHeroUpload}
            className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
          />
          {uploadingHero && (
            <p className="text-xs text-gray-400 mt-1">Nahravam...</p>
          )}
        </div>
      </div>

      {/* ===== Sponsors section ===== */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-gray-900">
            Sponzori
          </h2>
          <button
            onClick={() => {
              resetSponsorForm()
              setShowSponsorForm(true)
            }}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Pridat sponzora
          </button>
        </div>

        {/* Sponsor form */}
        {showSponsorForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-gray-900">
                {editingSponsorId ? 'Upravit sponzora' : 'Novy sponzor'}
              </h3>
              <button
                onClick={resetSponsorForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Nazev *
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Nazev sponzora"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tier
                </label>
                <select
                  value={sponsorTier}
                  onChange={(e) => setSponsorTier(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="main">Hlavni</option>
                  <option value="partner">Partner</option>
                  <option value="supporter">Supporter</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={sponsorWebsite}
                  onChange={(e) => setSponsorWebsite(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Logo
                </label>
                <div className="flex items-center gap-3">
                  {sponsorLogo && (
                    <div className="relative h-10 w-10 rounded bg-gray-100 overflow-hidden border border-gray-200">
                      <Image
                        src={sponsorLogo}
                        alt="Sponsor logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSponsorLogoUpload}
                    className="text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-600"
                  />
                </div>
                {uploadingSponsorLogo && (
                  <p className="text-xs text-gray-400 mt-1">Nahravam...</p>
                )}
              </div>
            </div>
            <button
              onClick={handleSaveSponsor}
              disabled={savingSponsor || !sponsorName}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              {savingSponsor ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Ulozit
            </button>
          </div>
        )}

        {/* Sponsors table */}
        {loadingSponsors ? (
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        ) : sponsors.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
            Zadni sponzori
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Logo
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Nazev
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Tier
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3">
                        {s.logo_url ? (
                          <div className="relative h-8 w-8 rounded bg-gray-100 overflow-hidden">
                            <Image
                              src={s.logo_url}
                              alt={s.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                            <Upload className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {s.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-semibold rounded-full px-2 py-0.5 ${
                            s.tier === 'main'
                              ? 'bg-yellow-100 text-yellow-700'
                              : s.tier === 'partner'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {TIER_LABELS[s.tier] || s.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEditSponsor(s)}
                            className="text-purple-600 hover:text-purple-800"
                            title="Upravit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSponsor(s.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Smazat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
