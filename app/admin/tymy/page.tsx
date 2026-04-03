'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { RefreshCw, Plus, Save, Trash2, Pencil, X } from 'lucide-react'

interface Team {
  id: string
  name: string
  slug: string
}

interface PlayerRow {
  id: string
  first_name: string
  last_name: string
  number: number | null
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  birth_year: number | null
  team_id: string
  sort_order: number | null
}

interface StaffRow {
  id: string
  name: string
  role: string
  team_id: string
}

const POSITION_LABELS: Record<string, string> = {
  GK: 'Brankar',
  DEF: 'Obrance',
  MID: 'Zaloznik',
  FWD: 'Utocnik',
}

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'] as const
const STAFF_ROLES = ['Trener', 'Asistent', 'Vedouci'] as const

export default function AdminTymyPage() {
  const supabase = getSupabaseBrowser()
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTeam, setActiveTeam] = useState<string>('')
  const [players, setPlayers] = useState<PlayerRow[]>([])
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [loading, setLoading] = useState(true)

  // Player form state
  const [showPlayerForm, setShowPlayerForm] = useState(false)
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null)
  const [pFirstName, setPFirstName] = useState('')
  const [pLastName, setPLastName] = useState('')
  const [pNumber, setPNumber] = useState('')
  const [pPosition, setPPosition] = useState<string>('MID')
  const [pBirthYear, setPBirthYear] = useState('')

  // Staff form state
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null)
  const [sName, setSName] = useState('')
  const [sRole, setSRole] = useState<string>('Trener')

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (activeTeam) fetchRoster(activeTeam)
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

  async function fetchRoster(teamId: string) {
    setLoading(true)
    const [playersRes, staffRes] = await Promise.all([
      supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('sort_order', { ascending: true }),
      supabase.from('staff').select('*').eq('team_id', teamId),
    ])
    setPlayers(playersRes.data || [])
    setStaff(staffRes.data || [])
    setLoading(false)
  }

  // ── Player CRUD ──

  function resetPlayerForm() {
    setShowPlayerForm(false)
    setEditingPlayerId(null)
    setPFirstName('')
    setPLastName('')
    setPNumber('')
    setPPosition('MID')
    setPBirthYear('')
  }

  function startEditPlayer(p: PlayerRow) {
    setEditingPlayerId(p.id)
    setPFirstName(p.first_name)
    setPLastName(p.last_name)
    setPNumber(p.number !== null ? String(p.number) : '')
    setPPosition(p.position)
    setPBirthYear(p.birth_year !== null ? String(p.birth_year) : '')
    setShowPlayerForm(true)
  }

  async function savePlayer() {
    if (!pFirstName || !pLastName) return
    const payload = {
      first_name: pFirstName,
      last_name: pLastName,
      number: pNumber ? Number(pNumber) : null,
      position: pPosition,
      birth_year: pBirthYear ? Number(pBirthYear) : null,
      team_id: activeTeam,
    }

    if (editingPlayerId) {
      await supabase.from('players').update(payload).eq('id', editingPlayerId)
    } else {
      await supabase.from('players').insert(payload)
    }
    resetPlayerForm()
    fetchRoster(activeTeam)
  }

  async function deletePlayer(id: string) {
    if (!confirm('Opravdu smazat hrace?')) return
    await supabase.from('players').delete().eq('id', id)
    fetchRoster(activeTeam)
  }

  // ── Staff CRUD ──

  function resetStaffForm() {
    setShowStaffForm(false)
    setEditingStaffId(null)
    setSName('')
    setSRole('Trener')
  }

  function startEditStaff(s: StaffRow) {
    setEditingStaffId(s.id)
    setSName(s.name)
    setSRole(s.role)
    setShowStaffForm(true)
  }

  async function saveStaff() {
    if (!sName) return
    const payload = {
      name: sName,
      role: sRole,
      team_id: activeTeam,
    }

    if (editingStaffId) {
      await supabase.from('staff').update(payload).eq('id', editingStaffId)
    } else {
      await supabase.from('staff').insert(payload)
    }
    resetStaffForm()
    fetchRoster(activeTeam)
  }

  async function deleteStaff(id: string) {
    if (!confirm('Opravdu smazat clena realizacniho tymu?')) return
    await supabase.from('staff').delete().eq('id', id)
    fetchRoster(activeTeam)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-bold text-lg text-gray-900">Tymy</h2>

      {/* Team selector */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Vyberte tym
        </label>
        <select
          value={activeTeam}
          onChange={(e) => setActiveTeam(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* ══════ PLAYERS ══════ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-gray-900">
                Hraci
              </h3>
              <button
                onClick={() => {
                  resetPlayerForm()
                  setShowPlayerForm(true)
                }}
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Pridat hrace
              </button>
            </div>

            {/* Player form */}
            {showPlayerForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">
                    {editingPlayerId ? 'Upravit hrace' : 'Novy hrac'}
                  </h4>
                  <button
                    onClick={resetPlayerForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Jmeno
                    </label>
                    <input
                      type="text"
                      value={pFirstName}
                      onChange={(e) => setPFirstName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Prijmeni
                    </label>
                    <input
                      type="text"
                      value={pLastName}
                      onChange={(e) => setPLastName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Cislo
                    </label>
                    <input
                      type="number"
                      value={pNumber}
                      onChange={(e) => setPNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Pozice
                    </label>
                    <select
                      value={pPosition}
                      onChange={(e) => setPPosition(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {POSITION_LABELS[pos]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Rocnik
                    </label>
                    <input
                      type="number"
                      value={pBirthYear}
                      onChange={(e) => setPBirthYear(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="napr. 1995"
                    />
                  </div>
                </div>
                <button
                  onClick={savePlayer}
                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Ulozit
                </button>
              </div>
            )}

            {/* Players table */}
            {players.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                Zadni hraci
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Cislo
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Jmeno
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Pozice
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Rocnik
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">
                          Akce
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50"
                        >
                          <td className="px-4 py-3 text-gray-600">
                            {p.number ?? '-'}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {p.first_name} {p.last_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {POSITION_LABELS[p.position] || p.position}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {p.birth_year ?? '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditPlayer(p)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Upravit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deletePlayer(p.id)}
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
          </section>

          {/* ══════ STAFF ══════ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-gray-900">
                Realizacni tym
              </h3>
              <button
                onClick={() => {
                  resetStaffForm()
                  setShowStaffForm(true)
                }}
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Pridat
              </button>
            </div>

            {/* Staff form */}
            {showStaffForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">
                    {editingStaffId ? 'Upravit' : 'Novy clen'}
                  </h4>
                  <button
                    onClick={resetStaffForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Jmeno
                    </label>
                    <input
                      type="text"
                      value={sName}
                      onChange={(e) => setSName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Role
                    </label>
                    <select
                      value={sRole}
                      onChange={(e) => setSRole(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {STAFF_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={saveStaff}
                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Ulozit
                </button>
              </div>
            )}

            {/* Staff table */}
            {staff.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                Zadni clenove
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Jmeno
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Role
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">
                          Akce
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {s.name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{s.role}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditStaff(s)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Upravit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteStaff(s.id)}
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
          </section>
        </>
      )}
    </div>
  )
}
