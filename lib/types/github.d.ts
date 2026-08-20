/**
 * GitHub API client: topic search with date-sharded pagination, package.json
 * verdict checks, topics read/write, and rate-limit bookkeeping. All network
 * calls live on the host side; the browser only talks to our own routes.
 */
export declare const UA = "dsh-store";
export interface RateInfo {
    limit: number;
    remaining: number;
    reset: number;
}
export declare function rateInfo(headers: Headers): RateInfo;
export declare function lastRateInfo(): RateInfo | null;
/** Pause between shard requests so the shared-IP quota is never burst. */
export declare function sleep(ms: number): Promise<void>;
export declare function shardInterval(token: string): number;
export interface SearchCallbacks {
    onShard?(index: number, total: number, repos: number): void;
    onError?(message: string): void;
}
/**
 * Fetch every public repo with the dsh-plugin topic. A single search query
 * caps at 1000 results, so the space is sliced by creation year (and month
 * when a year exceeds the cap) and merged with full_name de-duplication.
 */
export declare function searchDshTopicRepos(token: string, cb?: SearchCallbacks): Promise<unknown[]>;
export interface HtmlRepo {
    full_name: string;
    name: string;
    owner: string;
    html_url: string;
    pushed_at: string | null;
    language: string | null;
}
/**
 * Scrape the GitHub topic HTML pages (no API quota): every public repo
 * tagged dsh-plugin, ~30 per page. Parses owner/repo, pushed date and
 * language from the repository cards.
 */
export declare function fetchTopicPages(cb?: SearchCallbacks): Promise<HtmlRepo[]>;
/**
 * Deep verdict: does this repo look like a real dsh plugin? Reads the repo
 * root package.json and checks the dsh bundle/client fields and cordis
 * dependencies. null = undecidable (404 / rate limited / unreadable).
 */
export declare function packageJsonVerdict(token: string, repo: string): Promise<boolean | null>;
export declare function getRepoTopics(token: string, repo: string): Promise<{
    names: string[];
    rate: RateInfo;
}>;
export declare function putRepoTopics(token: string, repo: string, names: string[]): Promise<{
    names: string[];
    rate: RateInfo;
}>;
/** Repos the token owner can push to (for the publish picker). */
export declare function listMyRepos(token: string): Promise<{
    full_name: string;
    stargazers_count: number;
    private: boolean;
    description: string | null;
}[]>;
