import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Github } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AutoDocs AI
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Fonctionnalités
          </Link>
          <Link 
            href="#pricing" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Tarifs
          </Link>
          <Link 
            href="#about" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            À propos
          </Link>
        </div>

        {/* CTA */}
       <div className="flex items-center gap-3">
  <Link href="/login">
    <Button variant="ghost" size="sm">
      Connexion
    </Button>
  </Link>
  <Link href="/api/auth/signin">
    <Button size="sm" className="flex items-center gap-2">
      <Github className="w-4 h-4" />
      Commencer
    </Button>
  </Link>
</div>
      </nav>
    </header>
  )
}