'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { LinkIcon, Clock, Sparkles, Tag } from 'lucide-react'

interface CreateLinkFormProps {
  onLinkCreated: () => void
}

export function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [tags, setTags] = useState('')
  const [expiresIn, setExpiresIn] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          customAlias: customAlias || undefined,
          tags: tags || undefined,
          expiresIn: expiresIn ? parseInt(expiresIn) : null 
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link')
      }

      toast.success('Link created successfully')
      setUrl('')
      setCustomAlias('')
      setTags('')
      setExpiresIn('')
      onLinkCreated()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
          <LinkIcon className="w-6 h-6 text-primary" />
          Create New Short Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-base font-medium">Destination URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="h-12 text-base bg-background border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alias" className="text-base font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Custom Alias
              </Label>
              <Input
                id="alias"
                placeholder="my-custom-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                className="h-12 text-base bg-background border-border/50 focus:border-primary transition-colors"
                pattern="[a-z0-9-_]{3,20}"
                title="3-20 characters, lowercase letters, numbers, hyphens and underscores only"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="work, social, marketing"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="h-12 text-base bg-background border-border/50 focus:border-primary transition-colors"
                title="Comma-separated tags"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires" className="text-base font-medium">Expires in (minutes) - Optional</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="expires"
                type="number"
                placeholder="60"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="h-12 pl-11 text-base bg-background border-border/50 focus:border-primary transition-colors"
                min="1"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Shorten Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
