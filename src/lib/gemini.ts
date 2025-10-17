// src/lib/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. On initialise le client Gemini avec ta clé d'API.
// Il lit automatiquement la variable GEMINI_API_KEY depuis ton fichier .env.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// On choisit le modèle le plus adapté à l'analyse de code.
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

// 2. Le "Prompt" : C'est l'instruction précise qu'on donne à l'IA.
// C'est la partie la plus importante pour obtenir un résultat de qualité.
const getPrompt = (fileContent: string, language: string) => `
RÔLE:
Tu es un développeur senior expert en documentation technique, spécialisé en ${language}. Ton style est clair, concis et utile pour d'autres développeurs.

TÂCHE:
Analyse le fichier de code suivant et génère une documentation complète et bien structurée en Markdown.

FORMAT DE SORTIE OBLIGATOIRE:
Dois impérativement suivre cette structure Markdown, sans ajouter de texte d'introduction ou de conclusion :

### Résumé
*__Objectif Principal:__* Une phrase expliquant le rôle de ce fichier.

### Dépendances Clés
- **Nom de la dépendance**: Courte explication de son utilité.
- ... (liste les 2 ou 3 dépendances les plus importantes)

### Analyse Détaillée
---
#### Fonction / Composant : \`nomDeLaFonction\`
- **Description**: Explique ce que fait cette fonction.
- **Paramètres**:
    - \`nomDuParamètre\` (\`type\`) : Description du paramètre.
- **Retourne**: (\`type\`) Description de la valeur de retour.
---
(Répète cette section pour chaque fonction, méthode ou composant majeur du fichier)

### Logique Métier
- Explique en termes simples toute logique complexe, algorithme ou règle métier importante présente dans le code.

FICHIER DE CODE À ANALYSER CI-DESSOUS:
\`\`\`${language}
${fileContent}
\`\`\`
`;

// 3. La fonction principale que notre API appellera pour faire le travail.
export async function generateDocumentationForFile(fileContent: string, language: string): Promise<string> {
  try {
    const prompt = getPrompt(fileContent, language);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Erreur lors de la génération de la documentation par Gemini:", error);
    // En cas d'erreur de l'IA, on renvoie un message d'erreur clair.
    return "### Erreur\nLa génération de la documentation par l'IA a échoué. Veuillez réessayer plus tard.";
  }
}