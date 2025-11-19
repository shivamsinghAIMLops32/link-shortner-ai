'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeDialogProps {
  url: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QRCodeDialog({ url, open, onOpenChange }: QRCodeDialogProps) {
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return

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
      downloadLink.download = "qrcode.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <QRCode
              id="qr-code-svg"
              value={url}
              size={200}
              level="H"
            />
          </div>
          <Button onClick={downloadQRCode} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
