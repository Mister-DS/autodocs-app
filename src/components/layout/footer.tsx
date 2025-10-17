import Link from "next/link"
import { FileText, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoDocs AI
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Documentation automatique pour vos projets techniques. Gagnez du temps, améliorez votre code.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Statut
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} AutoDocs AI. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}