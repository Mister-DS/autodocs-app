"use client"

import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface GenerateDocsButtonProps {
  repositoryId: string
  hasDocumentation: boolean
}

export default function GenerateDocsButton({ repositoryId, hasDocumentation }: GenerateDocsButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!confirm('Générer la documentation pour ce repository ? Cela peut prendre quelques minutes.')) {
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/docs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repositoryId
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ ${data.message}`)
        router.refresh()
      } else {
        alert(`❌ ${data.error || 'Erreur lors de la génération'}`)
      }
    } catch (error) {
      console.error(error)
      alert('❌ Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant={hasDocumentation ? "secondary" : "default"}
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          {hasDocumentation ? 'Régénérer' : 'Générer la doc'}
        </>
      )}
    </Button>
  )
}