"use client"

import { Button } from "@/components/ui/button"
import { Check, Plus, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ActivateRepoButtonProps {
  repo: any
  isActive: boolean
}

export default function ActivateRepoButton({ repo, isActive }: ActivateRepoButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/repos/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubId: repo.id,
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          url: repo.url,
          language: repo.language,
          isPrivate: repo.isPrivate,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.refresh()
      } else {
        alert(data.error || 'Erreur lors de l\'opération')
      }
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l\'opération')
    } finally {
      setLoading(false)
    }
  }

  if (isActive) {
    return (
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleToggle}
        disabled={loading}
        className="border-red-600 text-red-600 hover:bg-red-50"
      >
        {loading ? (
          "..."
        ) : (
          <>
            <X className="w-4 h-4 mr-2" />
            Désactiver
          </>
        )}
      </Button>
    )
  }

  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "..." : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Activer
        </>
      )}
    </Button>
  )
}