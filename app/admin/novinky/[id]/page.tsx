'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { slugify } from '@/lib/slugify'
import { RefreshCw, Save, ArrowLeft } from 'lucide-react'

const CATEGORIES = ['Muzi', 'Mladez', 'Klub', 'Akce'] as const

export default function AdminArticleEditorPage() {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [category, setCategory] = useState<string>('Klub')
  const [body, setBody] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isNew) fetchArticle()
  }, [id])

  async function fetchArticle() {
    setLoading(true)
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setTitle(data.title || '')
      setSlug(data.slug || '')
      setSlugManual(true) // existing article, keep slug as-is
      setCategory(data.category || 'Klub')
      setBody(data.body || '')
      setExcerpt(data.excerpt || '')
      setIsPublished(data.is_published || false)
      setCoverImage(data.cover_image || null)
    }
    setLoading(false)
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManual) {
      setSlug(slugify(val))
    }
  }

  function handleSlugChange(val: string) {
    setSlugManual(true)
    setSlug(val)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `articles/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('articles')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (!error) {
      const { data: urlData } = supabase.storage
        .from('articles')
        .getPublicUrl(path)
      setCoverImage(urlData.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!title || !slug) return
    setSaving(true)

    const payload = {
      title,
      slug,
      category,
      body,
      excerpt: excerpt || body.slice(0, 200),
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      cover_image: coverImage,
    }

    if (isNew) {
      await supabase.from('articles').insert(payload)
    } else {
      await supabase.from('articles').update(payload).eq('id', id)
    }

    setSaving(false)
    router.push('/admin/novinky')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/novinky"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-heading font-bold text-lg text-gray-900">
            {isNew ? 'Novy clanek' : 'Upravit clanek'}
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !title}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Ulozit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Nazev *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Nadpis clanku"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Kategorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Titulni obrazek
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
            />
            {uploading && (
              <p className="text-xs text-gray-400 mt-1">Nahravam...</p>
            )}
            {coverImage && (
              <p className="text-xs text-green-600 mt-1 truncate">
                {coverImage}
              </p>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Perex (volitelny)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Kratky popis clanku..."
          />
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Publikovat
          </label>
        </div>
      </div>

      {/* Markdown editor */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Obsah (Markdown)
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono bg-white resize-y"
            placeholder="Piste clanek v Markdownu..."
          />

          {/* Preview */}
          <div className="border border-gray-200 rounded-xl px-5 py-4 bg-white overflow-y-auto prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 min-h-[20rem]">
            {body ? (
              <ReactMarkdown>{body}</ReactMarkdown>
            ) : (
              <p className="text-gray-300 italic">Nahled se zobrazi zde...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
