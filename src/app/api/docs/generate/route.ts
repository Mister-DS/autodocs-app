// Fichier : src/app/api/docs/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRepoContents, getRepoLanguages } from "@/lib/github";
import { db } from "@/lib/db";
import { generateDocsWithAI } from "@/lib/gemini";

const RELEVANT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.java', '.cs', '.rb',
  '.php', '.rs', '.md', 'README', '.json', '.yml', '.yaml'
]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { repoId, repoName, repoOwner } = await req.json();
  if (!repoId || !repoName || !repoOwner) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    console.log(`[API Doc Gen] Starting for ${repoOwner}/${repoName}`);
    const files = await getRepoContents(repoOwner, repoName, session.accessToken);

    const relevantFiles = files.filter(file => {
      if (file.type !== 'file' || !file.name) return false;
      const extension = `.${file.name.split('.').pop()}`;
      return RELEVANT_EXTENSIONS.has(extension) || file.name.toUpperCase().includes('README');
    });

    if (relevantFiles.length === 0) {
      return NextResponse.json({ error: "No relevant files found to document" }, { status: 404 });
    }

    await db.document.deleteMany({ where: { repositoryId: repoId } });

    for (const file of relevantFiles.slice(0, 10)) {
      if (!file.download_url) continue;

      const contentResponse = await fetch(file.download_url);
      const content = await contentResponse.text();
      
      const documentationContent = await generateDocsWithAI(content, file.name);

      // =========================================================
      // CORRECTION APPLIQUÉE ICI
      // On récupère l'extension du fichier...
      // =========================================================
      const fileExtension = file.name.split('.').pop() || 'unknown';

      await db.document.create({
        data: {
          fileName: file.name,
          filePath: file.path,
          content: documentationContent,
          sourceCode: content,
          type: fileExtension, // <-- ...et on ajoute le champ 'type' manquant.
          repository: {
            connect: {
              id: repoId,
            },
          },
        },
      });
      console.log(`[API Doc Gen] Successfully documented ${file.name}`);
    }

    const languages = await getRepoLanguages(repoOwner, repoName, session.accessToken);
    const primaryLanguage = Object.keys(languages)[0] || 'N/A';
    
    await db.repository.update({
        where: { id: repoId },
        data: {
            mainLanguage: primaryLanguage,
            lastDocUpdate: new Date(),
        }
    });

    return NextResponse.json({ success: true, message: `Documentation generated for ${relevantFiles.length} files.` });

  } catch (error) {
    console.error("[API Doc Gen] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: `Failed to generate documentation: ${errorMessage}` }, { status: 500 });
  }
}