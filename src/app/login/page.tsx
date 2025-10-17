import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, FileText, Sparkles } from "lucide-react"
import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect("/dashboard")
  }

  async function handleGitHubSignIn() {
    "use server"
    await signIn("github", { redirectTo: "/dashboard" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AutoDocs AI
            </span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue !
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connectez-vous avec GitHub pour commencer à automatiser votre documentation
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>3 repositories gratuits</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Documentation générée par IA</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Synchronisation automatique</span>
            </div>
          </div>

          <form action={handleGitHubSignIn}>
            <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              Continuer avec GitHub
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}