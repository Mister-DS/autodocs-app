import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserRepositories } from "@/lib/github"
import { db } from "@/lib/db"
import { GitBranch, Plus, FileText, Clock } from "lucide-react"
import ActivateRepoButton from "@/components/ActivateRepoButton"
import GenerateDocsButton from "@/components/GenerateDocsButton"
import Link from "next/link"

// Cache la page pendant 60 secondes
export const revalidate = 60

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // Récupérer les repos GitHub de l'utilisateur
  let repos = []
  let error = null
  
  if (session.accessToken) {
    try {
      repos = await getUserRepositories(session.accessToken)
    } catch (e) {
      error = "Impossible de récupérer vos repositories"
      console.error(e)
    }
  }

  // Récupérer les repos activés dans la DB (optimisé)
  const [activeRepos, allUserRepos] = await Promise.all([
    db.repository.findMany({
      where: {
        userId: String(session.user.id),
        isActive: true
      },
      include: {
        documents: {
          select: {
            id: true
          }
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
      <div className="container mx-auto px-4 py-8">
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
            <p className="text-sm text-gray-600 dark:text-gray-400">Repos avec documentation</p>
          </div>

          <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {activeRepos.length > 0 && activeRepos[0].lastSync 
                ? new Date(activeRepos[0].lastSync).toLocaleDateString('fr-FR')
                : '-'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dernière synchronisation</p>
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
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun repository trouvé</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez votre premier repository sur GitHub pour commencer
              </p>
              <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 h-11 px-6 py-2">
                  <Plus className="w-4 h-4" />
                  Créer un repository
                </button>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {repos.map((repo: any) => {
                const savedRepo = savedReposMap.get(repo.id)
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
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{repo.name}</h3>
                          {isActive && (
                            <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">
                              Activé
                            </span>
                          )}
                          {hasDocumentation && (
                            <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                              Doc générée
                            </span>
                          )}
                          {repo.isPrivate && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">Privé</span>
                          )}
                          {repo.language && (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">{repo.language}</span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            Voir sur GitHub
                          </a>
                          {hasDocumentation && repoId && (
                            <Link href={`/docs/${repoId}`} className="text-xs text-purple-600 hover:underline">
                              Voir la documentation
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && repoId && (
                          <GenerateDocsButton 
                            repositoryId={repoId}
                            hasDocumentation={hasDocumentation}
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