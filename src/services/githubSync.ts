import { GameStateData } from '../types';

export interface GithubSyncResult {
  newState?: GameStateData;
  sourceRepo?: string;
  sourcePath?: string;
  commitInfo?: { sha: string; message: string; date: string; author?: string };
  error?: string;
}

export const REPOS = {
  scriptorium: {
    name: 'ondrex-ember/scriptorium',
    url: 'https://github.com/ondrex-ember/scriptorium',
    rawEndpoints: [
      { path: 'scriptorium/gamestate.json', url: 'https://raw.githubusercontent.com/ondrex-ember/scriptorium/main/scriptorium/gamestate.json' },
      { path: 'scriptorium/data/gamestate.json', url: 'https://raw.githubusercontent.com/ondrex-ember/scriptorium/main/scriptorium/data/gamestate.json' },
      { path: 'gamestate.json', url: 'https://raw.githubusercontent.com/ondrex-ember/scriptorium/main/gamestate.json' },
    ],
    apiCommit: 'https://api.github.com/repos/ondrex-ember/scriptorium/commits/main'
  },
  chronicon: {
    name: 'ondrex-ember/chronicon',
    url: 'https://github.com/ondrex-ember/chronicon',
    rawEndpoints: [
      { path: 'data/gamestate.json', url: 'https://raw.githubusercontent.com/ondrex-ember/chronicon/main/data/gamestate.json' },
      { path: 'gamestate.json', url: 'https://raw.githubusercontent.com/ondrex-ember/chronicon/main/gamestate.json' }
    ],
    apiCommit: 'https://api.github.com/repos/ondrex-ember/chronicon/commits/main'
  }
};

export const GITHUB_ADMIN_REPO_URL = 'https://github.com/ondrex-ember/Scriptorium-admin';
export const GITHUB_SCRIPTORIUM_REPO_URL = 'https://github.com/ondrex-ember/scriptorium';
export const GITHUB_REPO_URL = GITHUB_SCRIPTORIUM_REPO_URL;

export async function fetchGithubState(currentState: GameStateData): Promise<GithubSyncResult> {
  const repoCandidates = [REPOS.scriptorium, REPOS.chronicon];

  for (const repo of repoCandidates) {
    // 1. Fetch commit metadata if possible
    let commitInfo: { sha: string; message: string; date: string; author?: string } | undefined;
    try {
      const commitRes = await fetch(repo.apiCommit, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        commitInfo = {
          sha: commitData.sha ? commitData.sha.substring(0, 7) : 'main',
          message: commitData.commit?.message || 'Aktualizace stavu',
          date: commitData.commit?.committer?.date || new Date().toISOString(),
          author: commitData.commit?.author?.name
        };
      }
    } catch (err) {
      console.warn(`Could not fetch commit info for ${repo.name}:`, err);
    }

    // 2. Try raw endpoints
    for (const endpoint of repo.rawEndpoints) {
      try {
        const res = await fetch(`${endpoint.url}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json && (json.time || json.actors)) {
            return {
              newState: json as GameStateData,
              sourceRepo: repo.name,
              sourcePath: endpoint.path,
              commitInfo
            };
          }
        }
      } catch (e) {
        // Continue trying next endpoint
      }
    }
  }

  return {
    error: 'Nebyl nalezen platný gamestate.json v repozitáři scriptorium (scriptorium/gamestate.json) ani chronicon.'
  };
}
