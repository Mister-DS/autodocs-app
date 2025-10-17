import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Github, 
  Zap, 
  GitBranch, 
  MessageSquare, 
  BookOpen, 
  RefreshCw,
  Check,
  ArrowRight,
  Sparkles
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Propulsé par l'IA Gemini
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Documentation{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                automatique
              </span>
              <br />
              pour vos projets
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connectez vos repos GitHub et laissez l'IA générer une documentation technique claire et à jour automatiquement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/api/auth/signin" className="w-full sm:w-auto">
                <Button size="lg" className="w-full flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Commencer avec GitHub
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Découvrir les fonctionnalités
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Gratuit pour 1 repo
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Sans carte bancaire
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Setup en 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Une suite complète d'outils pour automatiser votre documentation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyse automatique</h3>
              <p className="text-gray-600 dark:text-gray-400">
                L'IA analyse votre code et génère des pages de documentation intelligentes en quelques secondes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Synchronisation continue</h3>
              <p className="text-gray-600 dark:text-gray-400">
                La documentation se met à jour automatiquement à chaque commit pour rester toujours actuelle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GitBranch className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Résumé des PR & Commits</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Obtenez des explications claires des changements à chaque pull request et commit.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wiki interactif</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Documentation générée automatiquement dans Notion, Confluence ou notre interface interne.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat AI intégré</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Posez des questions sur votre code et obtenez des réponses instantanées basées sur votre projet.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">API REST complète</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intégrez AutoDocs dans vos outils préférés : Slack, Jira, Linear, et plus encore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Commencez gratuitement, évoluez quand vous êtes prêt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>3 repository</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Documentation de base</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Synchronisation manuelle</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Support communautaire</span>
                </li>
              </ul>
              <Link href="/api/auth/signin">
                <Button variant="outline" className="w-full">
                  Commencer
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-blue-600 bg-white dark:bg-gray-950 relative shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                Populaire
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">19,99€</span>
                <span className="text-gray-600 dark:text-gray-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>10 repositories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Sync automatique</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Chat AI illimité</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Intégrations (Slack, Notion)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Link href="/api/auth/signin">
                <Button className="w-full">
                  Commencer l'essai
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Sur mesure</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Repos illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Hébergement privé</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Conformité RGPD/ISO</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Support dédié 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>SLA garanti</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="secondary" className="w-full">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Prêt à améliorer votre documentation ?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Rejoignez des centaines de développeurs qui ont déjà automatisé leur documentation avec AutoDocs AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/api/auth/signin" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full flex items-center gap-2">
                <Github className="w-5 h-5" />
                Commencer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}