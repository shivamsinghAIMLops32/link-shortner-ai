'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, BarChart2, Clock, MoreVertical, Pencil, Trash2, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditLinkDialog } from './edit-link-dialog'
import { QRCodeDialog } from './qr-code-dialog'
import { motion } from 'framer-motion'

interface LinkCardProps {
  link: {
    id: string
    originalUrl: string
    shortCode: string
    customAlias?: string | null
    clicks: number
    expiresAt: string | null
    createdAt: string
  }
  onUpdate: () => void
}

export function LinkCard({ link, onUpdate }: LinkCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isQROpen, setIsQROpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shortUrl = `${origin}/${link.shortCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    toast.success('Copied to clipboard')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/links/${link.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Link deleted')
      onUpdate()
    } catch (error) {
      toast.error('Failed to delete link')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm group">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-primary hover:text-primary/80 truncate block transition-colors"
                  >
                    {shortUrl}
                  </a>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {link.originalUrl}
                </p>
                {link.customAlias && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Alias: {link.customAlias}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                    <BarChart2 className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium">{link.clicks} clicks</span>
                  </div>
                  {link.expiresAt && (
                    <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1 rounded-full text-orange-600 dark:text-orange-400">
                      <Clock className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsQROpen(true)}>
                      <QrCode className="mr-2 h-4 w-4" /> QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <EditLinkDialog 
        link={link} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        onLinkUpdated={onUpdate} 
      />
      
      <QRCodeDialog
        url={shortUrl}
        open={isQROpen}
        onOpenChange={setIsQROpen}
      />
    </>
  )
}
