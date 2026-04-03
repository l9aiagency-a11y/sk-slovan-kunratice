'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react'

interface Registration {
  id: string
  child_name: string
  birth_year: number | null
  preferred_category: string | null
  parent_name: string | null
  phone: string | null
  email: string | null
  note: string | null
  status: string
  created_at: string
}

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: 'Nova', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  contacted: { label: 'Kontaktovano', bg: 'bg-blue-100', text: 'text-blue-700' },
  enrolled: { label: 'Zapsano', bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Zamitnuto', bg: 'bg-red-100', text: 'text-red-700' },
}

export default function AdminPrihlaskyPage() {
  const supabase = getSupabaseBrowser()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    setLoading(true)
    const { data } = await supabase
      .from('youth_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    setRegistrations(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    await supabase
      .from('youth_registrations')
      .update({ status })
      .eq('id', id)
    await fetchRegistrations()
    setUpdatingId(null)
  }

  // Extract unique categories for filter chips
  const categories = Array.from(
    new Set(registrations.map((r) => r.preferred_category).filter(Boolean))
  ) as string[]

  const filtered = filterCategory
    ? registrations.filter((r) => r.preferred_category === filterCategory)
    : registrations

  function formatDate(dateStr: string) {
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

  function getStatusBadge(status: string) {
    const s = STATUS_MAP[status] || STATUS_MAP['new']
    return (
      <span
        className={`inline-block text-xs font-semibold ${s.bg} ${s.text} rounded-full px-2 py-0.5`}
      >
        {s.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-gray-900">
          Prihlasky mladeze
        </h2>
        <span className="text-sm text-gray-500">
          Celkem: {filtered.length}
        </span>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === null
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Vse
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilterCategory(filterCategory === cat ? null : cat)
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Zadne prihlasky
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Jmeno ditete
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Rocnik
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Kategorie
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Rodic
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Telefon
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Stav
                  </th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <>
                    <tr
                      key={r.id}
                      onClick={() =>
                        setExpandedId(expandedId === r.id ? null : r.id)
                      }
                      className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.child_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.birth_year || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.preferred_category || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.parent_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.phone || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(r.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {expandedId === r.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                    </tr>
                    {expandedId === r.id && (
                      <tr key={`detail-${r.id}`} className="bg-purple-50/50">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Jmeno ditete
                                </span>
                                <span className="text-sm text-gray-900">
                                  {r.child_name}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Rok narozeni
                                </span>
                                <span className="text-sm text-gray-900">
                                  {r.birth_year || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Kategorie
                                </span>
                                <span className="text-sm text-gray-900">
                                  {r.preferred_category || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Rodic
                                </span>
                                <span className="text-sm text-gray-900">
                                  {r.parent_name || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Telefon
                                </span>
                                <span className="text-sm text-gray-900 inline-flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                                  {r.phone || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Email
                                </span>
                                <span className="text-sm text-gray-900 inline-flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                                  {r.email || '-'}
                                </span>
                              </div>
                            </div>

                            {r.note && (
                              <div>
                                <span className="block text-xs font-medium text-gray-500 mb-0.5">
                                  Poznamka
                                </span>
                                <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">
                                  {r.note}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              {r.status !== 'contacted' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateStatus(r.id, 'contacted')
                                  }}
                                  disabled={updatingId === r.id}
                                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
                                >
                                  {updatingId === r.id && (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  )}
                                  Kontaktovano
                                </button>
                              )}
                              {r.status !== 'enrolled' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateStatus(r.id, 'enrolled')
                                  }}
                                  disabled={updatingId === r.id}
                                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
                                >
                                  {updatingId === r.id && (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  )}
                                  Zapsano
                                </button>
                              )}
                              {r.status !== 'rejected' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateStatus(r.id, 'rejected')
                                  }}
                                  disabled={updatingId === r.id}
                                  className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
                                >
                                  {updatingId === r.id && (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  )}
                                  Zamitnuto
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
