'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface EditLinkDialogProps {
  link: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onLinkUpdated: () => void
}

export function EditLinkDialog({ link, open, onOpenChange, onLinkUpdated }: EditLinkDialogProps) {
  const [url, setUrl] = useState(link.originalUrl)
  const [expiresIn, setExpiresIn] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          expiresIn: expiresIn ? parseInt(expiresIn) : undefined 
        })
      })

      if (!res.ok) throw new Error('Failed to update link')

      toast.success('Link updated successfully')
      onLinkUpdated()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-url">Destination URL</Label>
            <Input
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-expires">Update Expiry (minutes from now)</Label>
            <Input
              id="edit-expires"
              type="number"
              placeholder="Leave empty to keep current expiry"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              min="1"
            />
            <p className="text-xs text-muted-foreground">
              Enter a new duration to reset expiry, or leave blank to keep existing.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
