// Fichier : src/lib/parser.ts

/**
 * Analyse un bloc de code pour en extraire des informations de base et générer une documentation simple.
 * NOTE : Cette fonction utilise une analyse par expressions régulières et n'est pas un parseur AST complet.
 *
 * @param code Le contenu du fichier de code à analyser.
 * @param language Le langage de programmation du code (ex: 'typescript', 'python').
 * @returns Une chaîne de caractères formatée en Markdown contenant la documentation générée.
 */
// Correction 1: La fonction n'effectue aucune opération asynchrone (pas d'await).
// On retire donc "async" et on change le type de retour de "Promise<string>" à "string".
export function generateBasicDocumentation(
  code: string,
  language: string
): string {
  try {
    const lines = code.split('\n');
    const totalLines = lines.length;

    // Correction 2: Utilisation de regex pour une détection plus fiable.
    // L'ancienne méthode (.includes('const')) pouvait capturer n'importe quelle constante.
    const importRegex = /^\s*(import|from|require)/;
    const functionClassRegex = /^\s*(export\s+)?(async\s+)?(function|class|const|let)\s+[\w\s=()=>[\]{}]+[:{]/;

    const imports = lines
      .filter(line => importRegex.test(line))
      .slice(0, 10); // On garde la limite pour la lisibilité

    const functions = lines
      .filter(line => functionClassRegex.test(line) && !line.trim().startsWith('//'))
      .map(line => line.trim().replace(/\s{2,}/g, ' ')) // Nettoie les espaces en trop
      .slice(0, 10);

    // --- Construction de la documentation (logique inchangée) ---
    let doc = `# Documentation du Fichier\n\n`;

    doc += `## 📊 Statistiques\n`;
    doc += `- **Lignes de code :** ${totalLines}\n`;
    doc += `- **Langage :** ${language}\n\n`;

    if (imports.length > 0) {
      doc += `## 📦 Dépendances et Imports\n\n`;
      doc += '```' + language.toLowerCase() + '\n';
      doc += imports.join('\n');
      doc += '\n```\n\n';
    }

    if (functions.length > 0) {
      doc += `## 🔧 Fonctions et Composants Principaux\n\n`;
      doc += '```' + language.toLowerCase() + '\n';
      doc += functions.slice(0, 5).join('\n');
      doc += '\n```\n\n';
    }

    // Correction 3: Utilisation de regex avec des "word boundaries" (\b)
    // pour éviter de détecter des mots dans des commentaires ou des noms de variables.
    const hasAsync = /\basync\b/.test(code);
    const hasExport = /\bexport\b/.test(code);
    const hasClass = /\bclass\b/.test(code);
    const hasInterface = /\binterface\b/.test(code);
    const hasType = /\btype\b/.test(code);

    doc += `## 💡 Caractéristiques Détectées\n\n`;

    if (hasAsync) doc += `- ✅ **Code asynchrone** : Utilise des mots-clés \`async/await\`.\n`;
    if (hasExport) doc += `- ✅ **Module exporté** : Contient des \`exports\`.\n`;
    if (hasClass) doc += `- ✅ **Programmation orientée objet** : Contient des \`class\`.\n`;
    if (hasInterface || hasType) doc += `- ✅ **Typage Statique** : Utilise des \`type\` ou \`interface\`.\n`;
     if (!hasAsync && !hasExport && !hasClass && !hasInterface && !hasType) {
        doc += `- Aucune caractéristique spécifique détectée par l'analyse basique.\n`;
    }

    // --- Résumé (logique inchangée) ---
    doc += `\n## 📝 Résumé\n\n`;
    doc += `Ce fichier ${language} contient ${totalLines} lignes de code. `;

    if (imports.length > 0) {
      doc += `Il semble importer ${imports.length} dépendance(s). `;
    }

    if (functions.length > 0) {
      doc += `Il définit au moins ${functions.length} fonction(s) ou composant(s) principaux.`
    }

    return doc;

  } catch (error: any) {
    console.error("Erreur lors de la génération de la documentation basique:", error);
    return `# Erreur\n\nImpossible de générer la documentation pour ce fichier.`;
  }
}