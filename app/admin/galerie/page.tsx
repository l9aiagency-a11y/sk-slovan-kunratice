'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'

interface GalleryRow {
  id: string
  title: string
  date: string
  description: string | null
  photos: { url: string; caption: string }[]
  created_at: string
}

export default function AdminGaleriePage() {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const [galleries, setGalleries] = useState<GalleryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleries()
  }, [])

  async function fetchGalleries() {
    setLoading(true)
    const { data } = await supabase
      .from('galleries')
      .select('id, title, date, description, photos, created_at')
      .order('date', { ascending: false })
    setGalleries(data || [])
    setLoading(false)
  }

  async function deleteGallery(id: string, photos: { url: string; caption: string }[]) {
    if (!confirm('Opravdu smazat album a vsechny fotky?')) return

    // Delete photos from storage
    if (photos && photos.length > 0) {
      const paths = photos
        .map((p) => {
          const match = p.url.match(/galleries\/(.+)$/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]
      if (paths.length > 0) {
        await supabase.storage.from('galleries').remove(paths)
      }
    }

    await supabase.from('galleries').delete().eq('id', id)
    fetchGalleries()
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-gray-900">
          Galerie
        </h2>
        <button
          onClick={() => router.push('/admin/galerie/new')}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nove album
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          Zadna alba
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Nazev
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Pocet fotek
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {galleries.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {g.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(g.date)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {g.photos?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/galerie/${g.id}`)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Upravit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteGallery(g.id, g.photos)}
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
  )
}
