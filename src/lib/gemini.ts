export async function generateCodeDocumentation(
  code: string,
  language: string
): Promise<string> {
  try {
    // Génération simple de documentation basée sur l'analyse du code
    const lines = code.split('\n')
    const totalLines = lines.length
    
    // Extraire les imports/requires
    const imports = lines
      .filter(line => line.trim().startsWith('import ') || line.trim().startsWith('require('))
      .slice(0, 10)
    
    // Extraire les fonctions/classes
    const functions = lines
      .filter(line => 
        line.includes('function ') || 
        line.includes('const ') || 
        line.includes('class ') ||
        line.includes('export ')
      )
      .slice(0, 10)
    
    // Construire la documentation
    let doc = `# Documentation ${language}\n\n`
    
    doc += `## 📊 Statistiques\n`
    doc += `- **Lignes de code :** ${totalLines}\n`
    doc += `- **Langage :** ${language}\n\n`
    
    if (imports.length > 0) {
      doc += `## 📦 Dépendances et Imports\n\n`
      doc += '```' + language.toLowerCase() + '\n'
      doc += imports.join('\n')
      doc += '\n```\n\n'
    }
    
    if (functions.length > 0) {
      doc += `## 🔧 Fonctions et Composants Principaux\n\n`
      doc += '```' + language.toLowerCase() + '\n'
      doc += functions.slice(0, 5).join('\n')
      doc += '\n```\n\n'
    }
    
    // Analyser le contenu pour des mots-clés
    const hasAsync = code.includes('async')
    const hasExport = code.includes('export')
    const hasClass = code.includes('class ')
    const hasInterface = code.includes('interface ')
    const hasType = code.includes('type ')
    
    doc += `## 💡 Caractéristiques Détectées\n\n`
    
    if (hasAsync) doc += `- ✅ **Code asynchrone** : Utilise des fonctions async/await\n`
    if (hasExport) doc += `- ✅ **Module exporté** : Contient des exports ES6\n`
    if (hasClass) doc += `- ✅ **Programmation orientée objet** : Contient des classes\n`
    if (hasInterface || hasType) doc += `- ✅ **TypeScript** : Utilise des types et interfaces\n`
    
    doc += `\n## 📝 Résumé\n\n`
    doc += `Ce fichier ${language} contient ${totalLines} lignes de code. `
    
    if (imports.length > 0) {
      doc += `Il importe ${imports.length} dépendances. `
    }
    
    if (functions.length > 0) {
      doc += `Il définit ${functions.length} fonctions ou composants principaux.`
    }
    
    return doc
    
  } catch (error: any) {
    console.error("Erreur génération doc:", error)
    return `# ${language}\n\n**Fichier analysé**\n\nDocumentation basique générée automatiquement.\n\nLongueur: ${code.length} caractères`
  }
}