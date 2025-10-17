// Fichier : src/components/GenerateDocsButton.tsx
"use client"

import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// CORRECTION 1: On met à jour les props pour recevoir l'objet repository complet
// au lieu de juste son ID.
interface GenerateDocsButtonProps {
  repository: {
    id: string;
    name: string;
    fullName: string; // "owner/repoName"
    hasDocumentation: boolean;
  }
}

export default function GenerateDocsButton({ repository }: GenerateDocsButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!confirm('Générer la documentation pour ce repository ? Cela peut prendre quelques minutes.')) {
      return
    }

    setLoading(true)
    
    // On extrait le propriétaire du nom complet ("owner/repoName")
    const [repoOwner, repoName] = repository.fullName.split('/');

    try {
      const response = await fetch('/api/docs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // CORRECTION 2: On envoie maintenant les trois champs requis par l'API.
        body: JSON.stringify({
          repoId: repository.id,
          repoName: repoName,
          repoOwner: repoOwner,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ ${data.message || 'Documentation générée avec succès !'}`)
        router.refresh() // Met à jour la page pour afficher le nouvel état
      } else {
        alert(`❌ ${data.error || 'Une erreur est survenue lors de la génération.'}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API de génération:", error)
      alert('❌ Une erreur critique est survenue. Vérifiez la console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant={repository.hasDocumentation ? "secondary" : "default"}
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
          {repository.hasDocumentation ? 'Régénérer' : 'Générer la doc'}
        </>
      )}
    </Button>
  )
}