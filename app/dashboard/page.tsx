'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CreateLinkForm } from '@/components/create-link-form'
import { LinkCard } from '@/components/link-card'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { ModeToggle } from '@/components/mode-toggle'

export default function DashboardPage() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchLinks = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      const res = await fetch('/api/links')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch links')
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error(error)
      // Don't toast on polling error to avoid spam
      if (showLoading) toast.error('Failed to load links')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchLinks(true)
    
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchLinks(false)
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchLinks])

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            LinkShortify
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <section>
          <CreateLinkForm onLinkCreated={() => fetchLinks(true)} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Links</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-card/50 rounded-lg border border-dashed border-border">
              No links created yet. Start by creating one above!
            </div>
          ) : (
            <div className="grid gap-4">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} onUpdate={() => fetchLinks(false)} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
