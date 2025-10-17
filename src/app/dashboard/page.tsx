// Fichier : src/app/dashboard/page.tsx

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserRepositories } from "@/lib/github"
import { db } from "@/lib/db"
import { GitBranch, FileText, Clock } from "lucide-react"
import ActivateRepoButton from "@/components/ActivateRepoButton"
import GenerateDocsButton from "@/components/GenerateDocsButton"
import Link from "next/link"

// Cache la page pendant 60 secondes pour de meilleures performances
export const revalidate = 60

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // ==================================================================
  // LA CORRECTION PRINCIPALE EST ICI
  // On vérifie et utilise session.user.accessToken
  // ==================================================================
  let repos: any[] = []
  let error: string | null = null
  
  if (session.user.accessToken) {
    try {
      repos = await getUserRepositories(session.user.accessToken)
    } catch (e) {
      error = "Impossible de récupérer vos repositories depuis GitHub. Veuillez réessayer."
      console.error(e)
    }
  } else {
      error = "Votre session ne contient pas de token d'accès GitHub. Veuillez vous reconnecter."
  }

  // --- Le reste de votre logique est déjà bon ---

  // Récupérer les repos activés dans la DB (optimisé)
  const [activeRepos, allUserRepos] = await Promise.all([
    db.repository.findMany({
      where: {
        userId: String(session.user.id),
        isActive: true
      },
      include: {
        documents: {
          select: { id: true }
        }
      }
    }),
    db.repository.findMany({
      where: {
        userId: String(session.user.id)
      },
      select: {
        id: true,
        githubId: true,
        isActive: true
      }
    })
  ])

  // Map des repos activés et de tous les repos sauvegardés
  const activeRepoIds = new Set(activeRepos.map(r => r.githubId))
  const savedReposMap = new Map(allUserRepos.map(r => [r.githubId, { id: r.id, isActive: r.isActive }]))
  const reposWithDocs = new Set(activeRepos.filter(r => r.documents.length > 0).map(r => r.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 pt-24"> {/* Ajout de padding-top pour le header fixe */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {session.user.name} !
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos repositories et leur documentation automatique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{repos.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Repositories disponibles</p>
          </div>

          <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{activeRepos.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Repos avec doc activée</p>
          </div>

          <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {activeRepos.length > 0 && activeRepos[0].updatedAt 
                ? new Date(activeRepos[0].updatedAt).toLocaleDateString('fr-FR')
                : '-'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dernière mise à jour</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Vos Repositories GitHub</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {repos.length === 0 && !error ? (
            <div className="text-center py-12">
               <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
               <h3 className="mt-2 text-sm font-semibold">Aucun repository trouvé</h3>
               <p className="mt-1 text-sm text-gray-500">Nous n'avons pas pu charger vos repositories depuis GitHub.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repos.map((repo: any) => {
                const savedRepo = savedReposMap.get(String(repo.id)) // Assurer que l'ID est un string
                const isActive = savedRepo?.isActive === true
                const repoId = savedRepo?.id || ''
                const hasDocumentation = reposWithDocs.has(repoId)

                return (
                  <div key={repo.id} className={`p-4 border rounded-lg transition-colors ${
                    isActive 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={repo.html_url} target="_blank" className="font-semibold text-lg hover:underline">{repo.name}</Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{repo.description || "Pas de description"}</p>
                        {/* Tags et badges ici */}
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && repoId && (
                           <GenerateDocsButton 
                            repository={{ id: repoId }}
                          />
                        )}
                        <ActivateRepoButton 
                          repo={repo}
                          isActive={isActive}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}