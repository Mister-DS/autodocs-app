import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getRepositoryContent, getFileContent } from "@/lib/github"
import { generateCodeDocumentation } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { repositoryId } = await request.json()

    if (!repositoryId) {
      return NextResponse.json(
        { error: "Repository ID manquant" },
        { status: 400 }
      )
    }

    // Récupérer le repo depuis la DB
    const repository = await db.repository.findUnique({
      where: { 
        id: repositoryId,
        userId: String(session.user.id)
      }
    })

    if (!repository) {
      return NextResponse.json(
        { error: "Repository non trouvé" },
        { status: 404 }
      )
    }

    console.log('🎯 Repository:', repository.name, repository.fullName)

    // Extraire owner et repo name depuis fullName (ex: "user/repo")
    const [owner, repoName] = repository.fullName.split('/')
    console.log('👤 Owner:', owner, '📦 Repo:', repoName)

    // Récupérer les fichiers du repo
    const contents = await getRepositoryContent(
      session.accessToken,
      owner,
      repoName,
      ''
    )

    console.log('📁 Fichiers trouvés:', Array.isArray(contents) ? contents.length : 0)
    if (Array.isArray(contents) && contents.length > 0) {
      console.log('📄 Premiers fichiers:', contents.slice(0, 5).map((f: any) => f.name))
    }

    // Filtrer les fichiers de code
    const codeFiles = Array.isArray(contents) 
      ? contents.filter((file: any) => {
          const isValid = file.type === 'file' && 
            !file.path.includes('node_modules') &&
            !file.path.includes('.git') &&
            !file.path.startsWith('.') &&
            (file.name.endsWith('.js') || 
             file.name.endsWith('.ts') || 
             file.name.endsWith('.jsx') || 
             file.name.endsWith('.tsx') ||
             file.name.endsWith('.py') ||
             file.name.endsWith('.java') ||
             file.name === 'README.md' ||
             file.name === 'package.json')
          
          if (isValid) {
            console.log('✅ Fichier valide:', file.name)
          }
          return isValid
        })
      : []

    console.log('🎯 Fichiers à traiter:', codeFiles.length)

    let processedCount = 0
    const maxFiles = 5 // Limiter à 5 fichiers

    // Traiter les fichiers
    for (const file of codeFiles.slice(0, maxFiles)) {
      try {
        console.log('📖 Traitement de:', file.name)
        
        // Récupérer le contenu du fichier
        const fileContent = await getFileContent(
          session.accessToken,
          owner,
          repoName,
          file.path
        )

        console.log('📝 Contenu récupéré:', fileContent.length, 'caractères')

        // Limiter la taille
        const contentToAnalyze = fileContent.slice(0, 3000)

        // Déterminer le langage
        const extension = file.name.split('.').pop() || ''
        const languageMap: Record<string, string> = {
          'js': 'JavaScript',
          'ts': 'TypeScript',
          'jsx': 'React JSX',
          'tsx': 'React TSX',
          'py': 'Python',
          'java': 'Java',
          'md': 'Markdown',
          'json': 'JSON'
        }
        const language = languageMap[extension] || extension

        console.log('🤖 Génération doc avec Gemini pour:', file.name)

        // Générer la documentation avec Gemini
        const summary = await generateCodeDocumentation(contentToAnalyze, language)

        console.log('✅ Doc générée:', summary.slice(0, 100), '...')

        // Sauvegarder en DB
        await db.document.upsert({
          where: {
            repositoryId_filePath: {
              repositoryId: repository.id,
              filePath: file.path
            }
          },
          update: {
            content: fileContent.slice(0, 5000),
            summary,
            language,
            fileName: file.name,
            type: file.name === 'README.md' ? 'readme' : 'code'
          },
          create: {
            repositoryId: repository.id,
            filePath: file.path,
            fileName: file.name,
            content: fileContent.slice(0, 5000),
            summary,
            language,
            type: file.name === 'README.md' ? 'readme' : 'code'
          }
        })

        console.log('💾 Sauvegardé en DB:', file.name)
        processedCount++
      } catch (error) {
        console.error(`❌ Erreur pour ${file.name}:`, error)
      }
    }

    // Mettre à jour lastSync
    await db.repository.update({
      where: { id: repository.id },
      data: { lastSync: new Date() }
    })

    console.log('🎉 Terminé! Fichiers traités:', processedCount)

    return NextResponse.json({
      success: true,
      message: `Documentation générée pour ${processedCount} fichiers`,
      processedCount
    })

  } catch (error: any) {
    console.error("❌ Erreur lors de la génération:", error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}