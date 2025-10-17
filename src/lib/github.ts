import { Octokit } from '@octokit/rest'

/**
 * Create GitHub client with access token
 */
export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  })
}

/**
 * Get user's repositories
 */
export async function getUserRepositories(accessToken: string) {
  const octokit = createGitHubClient(accessToken)
  
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
  })
  
  return data.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    isPrivate: repo.private,
    updatedAt: repo.updated_at,
  }))
}

/**
 * Get repository content (files)
 */
export async function getRepositoryContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string = ''
) {
  const octokit = createGitHubClient(accessToken)
  
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  })
  
  return data
}

/**
 * Get file content from repository
 */
export async function getFileContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const octokit = createGitHubClient(accessToken)
  
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  })
  
  // Check if it's a file (not a directory)
  if ('content' in data && !Array.isArray(data)) {
    // Content is base64 encoded
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }
  
  throw new Error('Path is not a file')
}

/**
 * Get recent commits for a repository
 */
export async function getRepositoryCommits(
  accessToken: string,
  owner: string,
  repo: string,
  perPage: number = 10
) {
  const octokit = createGitHubClient(accessToken)
  
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
  })
  
  return data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name,
    date: commit.commit.author?.date,
    url: commit.html_url,
  }))
}

/**
 * Get commit details with diff
 */
export async function getCommitDetails(
  accessToken: string,
  owner: string,
  repo: string,
  sha: string
) {
  const octokit = createGitHubClient(accessToken)
  
  const { data } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: sha,
  })
  
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
  }
}