'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react'

interface ArticleRow {
  id: string
  title: string
  slug: string
  category: string
  is_published: boolean
  published_at: string | null
  created_at: string
}

export default function AdminNovinkyPage() {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    setLoading(true)
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, category, is_published, published_at, created_at')
      .order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  async function deleteArticle(id: string) {
    if (!confirm('Opravdu smazat clanek?')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
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
          Novinky
        </h2>
        <button
          onClick={() => router.push('/admin/novinky/new')}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novy clanek
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Zadne clanky
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
                    Stav
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Kategorie
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Datum
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {a.title}
                    </td>
                    <td className="px-4 py-3">
                      {a.is_published ? (
                        <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                          Publikovano
                        </span>
                      ) : (
                        <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                          Koncept
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.category}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(a.published_at || a.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/novinky/${a.id}`)
                          }
                          className="text-purple-600 hover:text-purple-800"
                          title="Upravit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteArticle(a.id)}
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
