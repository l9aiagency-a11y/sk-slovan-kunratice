'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import {
  Calendar,
  Newspaper,
  RefreshCw,
  UserPlus,
  Activity,
  Play,
  PenLine,
  Users,
} from 'lucide-react'

interface DashboardData {
  nextMatch: { opponent: string; date: string } | null
  articleCount: number
  lastScrape: { status: string; created_at: string } | null
  newRegistrations: number
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const supabase = getSupabaseBrowser()

    const [matchRes, articleRes, logRes, regRes] = await Promise.all([
      supabase
        .from('matches')
        .select('opponent, date')
        .is('home_score', null)
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('admin_logs')
        .select('status, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('youth_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new'),
    ])

    setData({
      nextMatch: matchRes.data
        ? { opponent: matchRes.data.opponent, date: matchRes.data.date }
        : null,
      articleCount: articleRes.count ?? 0,
      lastScrape: logRes.data
        ? { status: logRes.data.status, created_at: logRes.data.created_at }
        : null,
      newRegistrations: regRes.count ?? 0,
    })
    setLoading(false)
  }

  async function handleScrape() {
    setScraping(true)
    setScrapeResult(null)
    try {
      const res = await fetch('/api/scrape')
      const json = await res.json()
      if (json.success) {
        setScrapeResult('Scrape dokoncen uspesne.')
        fetchDashboardData()
      } else {
        setScrapeResult(`Chyba: ${json.error}`)
      }
    } catch {
      setScrapeResult('Scrape selhal. Zkuste to znovu.')
    } finally {
      setScraping(false)
    }
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
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
      <h2 className="font-heading font-bold text-lg text-gray-900">
        Prehled
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Next match */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Pristi zapas
            </span>
          </div>
          {data?.nextMatch ? (
            <>
              <p className="font-heading font-bold text-gray-900">
                {data.nextMatch.opponent}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(data.nextMatch.date)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Zadny naplanovany</p>
          )}
        </div>

        {/* Articles */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Newspaper className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Clanky</span>
          </div>
          <p className="font-heading font-bold text-2xl text-gray-900">
            {data?.articleCount ?? 0}
          </p>
        </div>

        {/* Last scrape */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Posledni scrape
            </span>
          </div>
          {data?.lastScrape ? (
            <>
              <p className="font-heading font-bold text-gray-900 flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    data.lastScrape.status === 'success'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                {data.lastScrape.status === 'success' ? 'Uspesne' : 'Chyba'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(data.lastScrape.created_at)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Nikdy</p>
          )}
        </div>

        {/* New registrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Nove prihlasky
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-heading font-bold text-2xl text-gray-900">
              {data?.newRegistrations ?? 0}
            </p>
            {(data?.newRegistrations ?? 0) > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Nove
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-sm text-gray-700">
          Rychle akce
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            {scraping ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {scraping ? 'Scrapuji...' : 'Spustit scrape'}
          </button>

          <Link
            href="/admin/novinky"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            <PenLine className="h-4 w-4" />
            Pridat clanek
          </Link>

          <Link
            href="/admin/tymy"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            <Users className="h-4 w-4" />
            Spravovat tymy
          </Link>
        </div>

        {scrapeResult && (
          <div
            className={`text-sm rounded-lg px-4 py-3 ${
              scrapeResult.startsWith('Chyba') || scrapeResult.includes('selhal')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {scrapeResult}
          </div>
        )}
      </div>
    </div>
  )
}
