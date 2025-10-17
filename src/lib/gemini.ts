// Fichier : src/lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function generateDocsWithAI(fileContent: string, fileName:string): Promise<string> {
  console.log(`[Gemini AI] Starting generation for file: ${fileName}`);

  try {
    // =========================================================
    // CORRECTION ICI : Changement du nom du modèle
    // =========================================================
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      **ROLE**: Tu es un expert en développement logiciel et documentation technique.
      **TASK**: Analyse le contenu du fichier de code suivant, nommé "${fileName}", et génère une documentation technique complète et professionnelle en Markdown.
      **FORMAT**:
      La documentation doit être structurée, claire, et inclure les sections suivantes :

      ### 📝 Résumé
      Une description globale de l'objectif et de la responsabilité principale de ce fichier en 2-3 phrases.

      ### ✨ Fonctionnalités clés
      Une liste à puces des fonctions, classes, ou composants les plus importants et leur rôle. Sois concis.

      ### 📦 Dépendances Principales
      Liste les imports les plus significatifs et explique brièvement leur utilité dans ce fichier.

      ### 🤔 Logique de fonctionnement
      Explique la logique ou le workflow principal du code. Par exemple, comment les fonctions interagissent-elles ?

      ### 💡 Améliorations Possibles
      Suggère 1 ou 2 pistes d'amélioration pertinentes.

      **IMPORTANT**: Ne produis que le contenu Markdown, sans aucune phrase d'introduction comme "Voici la documentation".

      --- DEBUT DU CODE ---
      ${fileContent}
      --- FIN DU CODE ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("[Gemini AI] Error during documentation generation:", error);
    return `## ❌ Erreur de Génération\n\nImpossible de générer la documentation pour **${fileName}**.\n\nL'API Gemini a peut-être rencontré un problème. Veuillez réessayer plus tard.`;
  }
}