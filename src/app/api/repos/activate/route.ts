import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { githubId, name, fullName, description, url, language, isPrivate } = body

    if (!githubId || !name || !fullName || !url) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // Vérifier si le repo existe déjà
    const existingRepo = await db.repository.findUnique({
      where: { githubId: Number(githubId) }
    })

    if (existingRepo) {
      // Si existe déjà, juste activer/désactiver
      const updatedRepo = await db.repository.update({
        where: { githubId: Number(githubId) },
        data: { isActive: !existingRepo.isActive }
      })

      return NextResponse.json({
        success: true,
        repository: updatedRepo,
        message: updatedRepo.isActive ? "Repository activé" : "Repository désactivé"
      })
    }

    // Sinon, créer un nouveau repo
    const newRepo = await db.repository.create({
      data: {
        userId: String(session.user.id),
        githubId: Number(githubId),
        name,
        fullName,
        description: description || null,
        url,
        language: language || null,
        isPrivate: Boolean(isPrivate),
        isActive: true,
      }
    })

    return NextResponse.json({
      success: true,
      repository: newRepo,
      message: "Repository activé avec succès"
    })

  } catch (error: any) {
    console.error("Erreur lors de l'activation du repository:", error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}