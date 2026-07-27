import { GameStateData } from '../types';

export interface GithubSyncInfo {
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMsg?: string;
  latestCommitSha?: string;
  latestCommitMessage?: string;
  repoUrl: string;
}

export const GITHUB_REPO_URL = 'https://github.com/ondrex-ember/chronicon';
export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ondrex-ember/chronicon/main';

export async function fetchGithubState(currentState: GameStateData): Promise<{
  newState?: Partial<GameStateData>;
  commitInfo?: { sha: string; message: string; date: string };
  error?: string;
}> {
  try {
    // 1. Fetch commit metadata from GitHub API
    let commitInfo: { sha: string; message: string; date: string } | undefined;
    try {
      const commitRes = await fetch('https://api.github.com/repos/ondrex-ember/chronicon/commits/main', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        commitInfo = {
          sha: commitData.sha ? commitData.sha.substring(0, 7) : 'main',
          message: commitData.commit?.message || 'Aktualizace stavu',
          date: commitData.commit?.committer?.date || new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Cannot fetch GitHub commit API, falling back to raw data fetch:', err);
    }

    // 2. Fetch raw gamestate or gm_input from repository
    const response = await fetch(`${GITHUB_RAW_BASE}/data/gamestate.json?t=${Date.now()}`);
    
    if (!response.ok) {
      // Try alternative raw path or construct enriched state with remote metadata
      throw new Error(`HTTP ${response.status}: Soubor gamestate.json nebyl na hlavní větvi nalezen.`);
    }

    const fetchedJson = await response.json();

    // Validate essential keys
    if (!fetchedJson.time || !fetchedJson.actors) {
      throw new Error('Formát staženého gamestate.json není platný.');
    }

    return {
      newState: fetchedJson as GameStateData,
      commitInfo
    };
  } catch (error: any) {
    console.error('Error syncing from GitHub:', error);
    return {
      error: error.message || 'Nepodařilo se připojit k GitHub repozitáři.'
    };
  }
}
