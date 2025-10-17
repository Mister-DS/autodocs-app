import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Github, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { auth } from "@/lib/auth"
import Image from "next/image"

export async function Header() {
  const session = await auth()

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

        {/* CTA - Affichage conditionnel */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            // Utilisateur connecté
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              
              {/* Avatar et menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  
                  <div className="p-2">
                    <Link href="/dashboard">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                    </Link>
                    <Link href="/settings">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </button>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                    <form action="/api/auth/signout" method="POST">
                      <button 
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Utilisateur non connecté
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  )
}