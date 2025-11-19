'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { LinkIcon, Clock } from 'lucide-react'

interface CreateLinkFormProps {
    onLinkCreated: () => void
}

export function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
    const [url, setUrl] = useState('')
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
                    expiresIn: expiresIn ? parseInt(expiresIn) : null
                })
            })

            if (!res.ok) throw new Error('Failed to create link')

            toast.success('Link created successfully')
            setUrl('')
            setExpiresIn('')
            onLinkCreated()
        } catch (error) {
            toast.error('Failed to create link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                    Create New Link
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Destination URL</Label>
                        <Input
                            id="url"
                            placeholder="https://example.com/very-long-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expires">Expires in (minutes) - Optional</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="expires"
                                type="number"
                                placeholder="60"
                                value={expiresIn}
                                onChange={(e) => setExpiresIn(e.target.value)}
                                className="pl-9 bg-white"
                                min="1"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Shorten Link'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
