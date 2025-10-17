// Fichier : src/lib/github.ts

import { Octokit } from '@octokit/rest';

/**
 * Crée un client GitHub avec un token d'accès.
 */
export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

/**
 * Récupère les dépôts de l'utilisateur authentifié.
 */
export async function getUserRepositories(accessToken: string) {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
  });
  
  return data.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    isPrivate: repo.private,
    updatedAt: repo.updated_at,
  }));
}

/**
 * CORRECTION 1: Le nom a été changé de "getRepositoryContent" à "getRepoContents"
 * pour correspondre à l'import dans votre API.
 * * Récupère le contenu d'un dépôt (fichiers et dossiers).
 */
export async function getRepoContents(
  owner: string,
  repo: string,
  accessToken: string,
  path: string = ''
) {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });
  
  // S'assure que la réponse est bien un tableau (cas des dossiers)
  if (Array.isArray(data)) {
    return data;
  }
  
  // Si le chemin pointe vers un seul fichier, on le retourne dans un tableau pour être cohérent
  return [data];
}

/**
 * CORRECTION 2: Cette fonction était manquante et a été ajoutée.
 * * Récupère les langages utilisés dans un dépôt.
 */
export async function getRepoLanguages(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<Record<string, number>> {
    const octokit = createGitHubClient(accessToken);
    const { data } = await octokit.repos.listLanguages({
        owner,
        repo,
    });
    return data;
}

/**
 * Récupère le contenu d'un fichier spécifique depuis un dépôt.
 */
export async function getFileContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });
  
  // Vérifie si c'est un fichier et s'il a du contenu
  if ('content' in data && !Array.isArray(data)) {
    // Le contenu est encodé en base64, il faut le décoder
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  
  throw new Error('Le chemin spécifié n\'est pas un fichier ou son contenu est vide.');
}

/**
 * Récupère les commits récents pour un dépôt.
 */
export async function getRepositoryCommits(
  accessToken: string,
  owner: string,
  repo: string,
  perPage: number = 10
) {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
  });
  
  return data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name,
    date: commit.commit.author?.date,
    url: commit.html_url,
  }));
}

/**
 * Récupère les détails d'un commit spécifique avec les modifications (diff).
 */
export async function getCommitDetails(
  accessToken: string,
  owner: string,
  repo: string,
  sha: string
) {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });
  
  return {
    sha: data.sha,
    message: data.commit.message,
    author: data.commit.author?.name,
    date: data.commit.author?.date,
    files: data.files?.map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    })),
  };
}