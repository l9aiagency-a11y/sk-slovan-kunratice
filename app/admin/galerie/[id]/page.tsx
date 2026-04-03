'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, Save, ArrowLeft, Upload, X } from 'lucide-react'

interface Photo {
  url: string
  caption: string
}

export default function AdminGalleryEditorPage() {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [galleryId, setGalleryId] = useState<string | null>(isNew ? null : id)
  const [dragOver, setDragOver] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isNew) fetchGallery()
  }, [id])

  async function fetchGallery() {
    setLoading(true)
    const { data } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setTitle(data.title || '')
      setDate(data.date || '')
      setDescription(data.description || '')
      setPhotos(data.photos || [])
      setGalleryId(data.id)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!title) return
    setSaving(true)
    setMessage(null)

    const payload = {
      title,
      date: date || new Date().toISOString().split('T')[0],
      description: description || null,
      photos,
    }

    if (isNew) {
      const { data, error } = await supabase
        .from('galleries')
        .insert(payload)
        .select('id')
        .single()

      if (data) {
        setGalleryId(data.id)
        setMessage('Album vytvoreno')
        // Redirect to edit the newly created gallery
        router.replace(`/admin/galerie/${data.id}`)
      }
      if (error) {
        setMessage(`Chyba: ${error.message}`)
      }
    } else {
      const { error } = await supabase
        .from('galleries')
        .update(payload)
        .eq('id', id)

      if (error) {
        setMessage(`Chyba: ${error.message}`)
      } else {
        setMessage('Album ulozeno')
      }
    }

    setSaving(false)
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!galleryId && isNew) {
      // Need to save gallery first to get an ID
      setMessage('Nejprve ulozte album, pak nahrajte fotky.')
      return
    }

    const targetId = galleryId || id
    setUploading(true)
    const newPhotos: Photo[] = [...photos]

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const path = `${targetId}/${filename}`

      const { error } = await supabase.storage
        .from('galleries')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('galleries')
          .getPublicUrl(path)
        newPhotos.push({ url: urlData.publicUrl, caption: '' })
      }
    }

    setPhotos(newPhotos)

    // Auto-save photos to DB
    if (!isNew) {
      await supabase
        .from('galleries')
        .update({ photos: newPhotos })
        .eq('id', targetId)
    }

    setUploading(false)
  }

  async function removePhoto(index: number) {
    const photo = photos[index]
    // Extract storage path from URL
    const match = photo.url.match(/galleries\/(.+)$/)
    if (match) {
      await supabase.storage.from('galleries').remove([match[1]])
    }

    const updated = photos.filter((_, i) => i !== index)
    setPhotos(updated)

    // Auto-save
    if (!isNew && galleryId) {
      await supabase
        .from('galleries')
        .update({ photos: updated })
        .eq('id', galleryId)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files)
      }
    },
    [galleryId, photos]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

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
            href="/admin/galerie"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-heading font-bold text-lg text-gray-900">
            {isNew ? 'Nove album' : 'Upravit album'}
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

      {message && (
        <div
          className={`text-sm rounded-lg px-4 py-3 ${
            message.includes('Chyba')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Nazev alba *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Nazev alba"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Datum
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm max-w-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Popis
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Popis alba (volitelny)..."
          />
        </div>
      </div>

      {/* Photo upload section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-heading font-bold text-sm text-gray-900">
          Fotky
        </h3>

        {/* Drag & drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          } ${isNew && !galleryId ? 'opacity-50' : ''}`}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-2">
            Pretahnete fotky sem nebo kliknete
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            disabled={isNew && !galleryId}
            className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
          />
          {isNew && !galleryId && (
            <p className="text-xs text-amber-600 mt-2">
              Nejprve ulozte album
            </p>
          )}
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Nahravam fotky...
          </div>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `Fotka ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Smazat fotku"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && !uploading && (
          <p className="text-sm text-gray-400 text-center py-4">
            Zatim zadne fotky
          </p>
        )}
      </div>
    </div>
  )
}
