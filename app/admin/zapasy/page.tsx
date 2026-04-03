'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, Plus, Download, X, Save } from 'lucide-react'

interface Team {
  id: string
  name: string
  slug: string
}

interface MatchRow {
  id: string
  team_id: string
  date: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  is_home: boolean
  competition: string
  round: string | null
  venue: string | null
  notes: string | null
}

export default function AdminZapasyPage() {
  const supabase = getSupabaseBrowser()
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [scrapeMsg, setScrapeMsg] = useState<string | null>(null)

  // Edit form state
  const [editHomeScore, setEditHomeScore] = useState<string>('')
  const [editAwayScore, setEditAwayScore] = useState<string>('')
  const [editNotes, setEditNotes] = useState('')

  // Add form state
  const [addTeamId, setAddTeamId] = useState('')
  const [addOpponent, setAddOpponent] = useState('')
  const [addDate, setAddDate] = useState('')
  const [addVenue, setAddVenue] = useState('')
  const [addIsHome, setAddIsHome] = useState(true)
  const [addCompetition, setAddCompetition] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (activeTeam) fetchMatches(activeTeam)
  }, [activeTeam])

  async function fetchTeams() {
    const { data } = await supabase
      .from('teams')
      .select('id, name, slug')
      .order('sort_order', { ascending: true })
    if (data && data.length > 0) {
      setTeams(data)
      setActiveTeam(data[0].id)
    }
    setLoading(false)
  }

  async function fetchMatches(teamId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('matches')
      .select('*')
      .eq('team_id', teamId)
      .order('date', { ascending: false })
    setMatches(data || [])
    setLoading(false)
  }

  function startEdit(m: MatchRow) {
    setEditingId(m.id)
    setEditHomeScore(m.home_score !== null ? String(m.home_score) : '')
    setEditAwayScore(m.away_score !== null ? String(m.away_score) : '')
    setEditNotes(m.notes || '')
  }

  async function saveEdit(matchId: string) {
    const updates: Record<string, unknown> = {
      home_score: editHomeScore !== '' ? Number(editHomeScore) : null,
      away_score: editAwayScore !== '' ? Number(editAwayScore) : null,
      notes: editNotes || null,
    }
    await supabase.from('matches').update(updates).eq('id', matchId)
    setEditingId(null)
    if (activeTeam) fetchMatches(activeTeam)
  }

  async function handleAdd() {
    const teamId = addTeamId || activeTeam
    if (!teamId || !addOpponent || !addDate) return

    const teamName = 'SK Slovan Kunratice'
    await supabase.from('matches').insert({
      team_id: teamId,
      date: addDate,
      home_team: addIsHome ? teamName : addOpponent,
      away_team: addIsHome ? addOpponent : teamName,
      home_score: null,
      away_score: null,
      is_home: addIsHome,
      competition: addCompetition || '',
      venue: addVenue || null,
    })

    setShowAdd(false)
    setAddOpponent('')
    setAddDate('')
    setAddVenue('')
    setAddIsHome(true)
    setAddCompetition('')
    if (activeTeam) fetchMatches(activeTeam)
  }

  async function handleScrape() {
    setScraping(true)
    setScrapeMsg(null)
    try {
      const res = await fetch('/api/scrape')
      const json = await res.json()
      if (json.success) {
        setScrapeMsg('Scrape dokoncen uspesne.')
        if (activeTeam) fetchMatches(activeTeam)
      } else {
        setScrapeMsg(`Chyba: ${json.error}`)
      }
    } catch {
      setScrapeMsg('Scrape selhal.')
    } finally {
      setScraping(false)
    }
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-gray-900">
          Zapasy
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
          >
            {scraping ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {scraping ? 'Scrapuji...' : 'Scrapovat data'}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Pridat zapas
          </button>
        </div>
      </div>

      {scrapeMsg && (
        <div
          className={`text-sm rounded-lg px-4 py-3 ${
            scrapeMsg.includes('Chyba') || scrapeMsg.includes('selhal')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {scrapeMsg}
        </div>
      )}

      {/* Team chips */}
      <div className="flex flex-wrap gap-2">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTeam(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTeam === t.id
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Add match form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Novy zapas
            </h3>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Tym
              </label>
              <select
                value={addTeamId || activeTeam || ''}
                onChange={(e) => setAddTeamId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Souper
              </label>
              <input
                type="text"
                value={addOpponent}
                onChange={(e) => setAddOpponent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nazev soupere"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Datum a cas
              </label>
              <input
                type="datetime-local"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Hriste
              </label>
              <input
                type="text"
                value={addVenue}
                onChange={(e) => setAddVenue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Misto konani"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Soutez
              </label>
              <input
                type="text"
                value={addCompetition}
                onChange={(e) => setAddCompetition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nazev souteze"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isHome"
                checked={addIsHome}
                onChange={(e) => setAddIsHome(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isHome" className="text-sm text-gray-700">
                Domaci zapas
              </label>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            <Save className="h-4 w-4" />
            Ulozit
          </button>
        </div>
      )}

      {/* Matches table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Zadne zapasy pro vybrany tym
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Datum
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Domaci
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">
                    Skore
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Hoste
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <>
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(m.date)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {m.home_team}
                      </td>
                      <td className="px-4 py-3 text-center font-heading font-bold">
                        {m.home_score !== null && m.away_score !== null ? (
                          <span className="text-gray-900">
                            {m.home_score} : {m.away_score}
                          </span>
                        ) : (
                          <span className="text-gray-400">-- : --</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {m.away_team}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            editingId === m.id ? setEditingId(null) : startEdit(m)
                          }
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          {editingId === m.id ? 'Zrusit' : 'Upravit'}
                        </button>
                      </td>
                    </tr>
                    {editingId === m.id && (
                      <tr key={`edit-${m.id}`} className="bg-purple-50/50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="text-xs font-medium text-gray-500">
                                Skore:
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={editHomeScore}
                                onChange={(e) => setEditHomeScore(e.target.value)}
                                className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center"
                                placeholder="D"
                              />
                              <span className="text-gray-400 font-bold">:</span>
                              <input
                                type="number"
                                min={0}
                                value={editAwayScore}
                                onChange={(e) => setEditAwayScore(e.target.value)}
                                className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center"
                                placeholder="H"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Poznamky
                              </label>
                              <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                placeholder="Strelci, poznamky..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(m.id)}
                                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-1.5 transition-colors"
                              >
                                <Save className="h-3.5 w-3.5" />
                                Ulozit
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                              >
                                Zrusit
                              </button>
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
