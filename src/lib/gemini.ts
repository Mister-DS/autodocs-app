import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables')
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Get Gemini model instance
 * @param modelName - Default: gemini-1.5-flash (fastest, free)
 */
export function getGeminiModel(modelName: string = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model: modelName })
}

/**
 * Analyze code and generate documentation
 */
export async function generateCodeDocumentation(code: string, language: string): Promise<string> {
  const model = getGeminiModel()
  
  const prompt = `Tu es un expert en documentation technique. Analyse ce code ${language} et génère une documentation claire et concise en français.

Instructions :
- Explique ce que fait le code
- Liste les fonctions principales et leurs rôles
- Identifie les dépendances importantes
- Donne des exemples d'utilisation si pertinent
- Reste concis et professionnel

Code à analyser :
\`\`\`${language}
${code}
\`\`\`

Génère la documentation en format Markdown.`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}

/**
 * Generate a summary of commit changes
 */
export async function summarizeCommit(diff: string): Promise<string> {
  const model = getGeminiModel()
  
  const prompt = `Résume ce changement git en une phrase claire et concise en français.

Diff :
${diff}

Réponds en une seule phrase qui décrit l'essentiel du changement.`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}

/**
 * Answer questions about code (for chat feature)
 */
export async function answerCodeQuestion(question: string, codeContext: string): Promise<string> {
  const model = getGeminiModel()
  
  const prompt = `Tu es un assistant qui aide à comprendre du code. Réponds à la question de l'utilisateur en te basant sur le contexte fourni.

Contexte du code :
${codeContext}

Question : ${question}

Réponds de manière claire et précise en français.`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}

export default genAI