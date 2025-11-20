'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CreateLinkForm } from '@/components/create-link-form'
import { LinkCard } from '@/components/link-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogOut, Github, Heart, Search } from 'lucide-react'
import { toast } from 'sonner'
import { ModeToggle } from '@/components/mode-toggle'

export default function DashboardPage() {
  const [links, setLinks] = useState<any[]>([])
  const [filteredLinks, setFilteredLinks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
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
      setFilteredLinks(data)
    } catch (error) {
      console.error(error)
      if (showLoading) toast.error('Failed to load links')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchLinks(true)
    
    const interval = setInterval(() => {
      fetchLinks(false)
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchLinks])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLinks(links)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = links.filter(link => 
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query) ||
      (link.customAlias && link.customAlias.toLowerCase().includes(query)) ||
      (link.tags && link.tags.toLowerCase().includes(query))
    )
    setFilteredLinks(filtered)
  }, [searchQuery, links])

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
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

      <main className="flex-1 max-w-5xl mx-auto p-6 w-full space-y-8">
        <section>
          <CreateLinkForm onLinkCreated={() => fetchLinks(true)} />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">Your Links ({filteredLinks.length})</h2>
            <div className="relative w-full sm:w-auto sm:min-w-80">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search links, tags, aliases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-card/50 rounded-lg border border-dashed border-border">
              {searchQuery ? `No links found matching "${searchQuery}"` : 'No links created yet. Start by creating one above!'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLinks.map((link) => (
                <LinkCard key={link.id} link={link} onUpdate={() => fetchLinks(false)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© 2024 LinkShortify. Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target=" _blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
