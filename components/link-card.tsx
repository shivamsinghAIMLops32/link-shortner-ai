'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, BarChart2, Clock, MoreVertical, Pencil, Trash2, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditLinkDialog } from './edit-link-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from "react-qr-code"

interface LinkCardProps {
  link: {
    id: string
    originalUrl: string
    shortCode: string
    customAlias?: string | null
    tags?: string | null
    clicks: number
    expiresAt: string | null
    createdAt: string
  }
  onUpdate: () => void
}

export function LinkCard({ link, onUpdate }: LinkCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shortUrl = `${origin}/${link.customAlias || link.shortCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    toast.success('Copied to clipboard')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/links/${link.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      toast.success('Link deleted')
      onUpdate() // This should trigger a refetch
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete link')
    } finally {
      setIsDeleting(false)
    }
  }

  const tags = link.tags ? link.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm group">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Main Content */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* URL Section */}
                <div className="space-y-2 flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a 
                      href={shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-primary hover:text-primary/80 truncate transition-colors"
                    >
                      {shortUrl}
                    </a>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{link.originalUrl}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {link.customAlias && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-primary border border-primary/20">
                        Custom: {link.customAlias}
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/50 text-foreground border border-border/50">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stats and Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                      <BarChart2 className="h-4 w-4 text-indigo-500" />
                      <span className="font-semibold text-sm">{link.clicks}</span>
                      <span className="text-xs text-muted-foreground">clicks</span>
                    </div>
                    {link.expiresAt && (
                      <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium">{formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQR(!showQR)}
                      className="h-8 text-xs opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                    >
                      {showQR ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                      QR
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" disabled={isDeleting}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600" disabled={isDeleting}>
                          <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <QRCode
                            value={shortUrl}
                            size={window.innerWidth < 640 ? 150 : 180}
                            level="H"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-semibold text-base mb-2">Scan to visit</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Scan this QR code with your phone camera to quickly access this link
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const svg = document.querySelector(`svg[data-qr="${link.id}"]`) as SVGElement
                              if (!svg) {
                                // Fallback: try to find any QR code SVG
                                const allQRs = document.querySelectorAll('svg')
                                const qrSvg = Array.from(allQRs).find(s => s.querySelector('rect'))
                                if (!qrSvg) return
                                
                                const svgData = new XMLSerializer().serializeToString(qrSvg)
                                const canvas = document.createElement("canvas")
                                const ctx = canvas.getContext("2d")
                                const img = new Image()
                                
                                img.onload = () => {
                                  canvas.width = img.width
                                  canvas.height = img.height
                                  ctx?.drawImage(img, 0, 0)
                                  const pngFile = canvas.toDataURL("image/png")
                                  const downloadLink = document.createElement("a")
                                  downloadLink.download = `qr-${link.customAlias || link.shortCode}.png`
                                  downloadLink.href = pngFile
                                  downloadLink.click()
                                }
                                
                                img.src = "data:image/svg+xml;base64," + btoa(svgData)
                                return
                              }
                              
                              const svgData = new XMLSerializer().serializeToString(svg)
                              const canvas = document.createElement("canvas")
                              const ctx = canvas.getContext("2d")
                              const img = new Image()
                              
                              img.onload = () => {
                                canvas.width = img.width
                                canvas.height = img.height
                                ctx?.drawImage(img, 0, 0)
                                const pngFile = canvas.toDataURL("image/png")
                                const downloadLink = document.createElement("a")
                                downloadLink.download = `qr-${link.customAlias || link.shortCode}.png`
                                downloadLink.href = pngFile
                                downloadLink.click()
                              }
                              
                              img.src = "data:image/svg+xml;base64," + btoa(svgData)
                            }}
                          >
                            Download QR Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
    </>
  )
}
