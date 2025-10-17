// src/app/api/docs/generate/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // <-- IMPORTATION CORRIGÉE : on importe "auth"
import { getFileContent, getRepoLanguage } from '@/lib/github';
import { db } from '@/lib/db';
import { generateDocumentationForFile } from '@/lib/gemini';

export async function POST(request: Request) {
  const session = await auth(); // <-- APPEL CORRIGÉ : on appelle "auth()" directement
  
  if (!session?.user?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // On récupère les données envoyées par le bouton du dashboard
  const { repositoryId, filePath } = await request.json(); 
  if (!repositoryId || !filePath) {
    return new NextResponse('Missing repositoryId or filePath', { status: 400 });
  }

  try {
    const repo = await db.repository.findUnique({
      where: { id: repositoryId },
    });

    if (!repo) {
      return new NextResponse('Repository not found', { status: 404 });
    }

    // 1. Récupérer le contenu du fichier via l'API GitHub
    const fileContent = await getFileContent(
      repo.owner,
      repo.name,
      filePath,
      session.user.accessToken
    );

    if (fileContent === null) {
      return new NextResponse('File not found or content is empty', { status: 404 });
    }
    
    // 2. Déterminer le langage du repo pour aider l'IA
    const language = repo.language || 'typescript';

    // 3. Appeler Gemini pour générer la documentation ✨
    const generatedMarkdown = await generateDocumentationForFile(fileContent, language);

    // 4. Sauvegarder ou mettre à jour la documentation dans la base de données
    const document = await db.document.upsert({
      where: {
        repositoryId_path: {
          repositoryId: repositoryId,
          path: filePath,
        },
      },
      update: {
        content: generatedMarkdown,
        generatedAt: new Date(),
      },
      create: {
        repositoryId: repositoryId,
        path: filePath,
        content: generatedMarkdown,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('[DOCS_GENERATE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}