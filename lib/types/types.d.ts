/** Shared host-side types for the market data pipeline. */
export interface GhRepo {
    full_name: string;
    name: string;
    description: string | null;
    stargazers_count: number;
    created_at: string;
    pushed_at: string;
    updated_at: string;
    topics: string[];
    archived: boolean;
    fork: boolean;
    html_url: string;
    language: string | null;
    owner: {
        login: string;
        avatar_url: string;
    };
    /** 索引富化出的中文简介（README.zh 首段），可能缺失。 */
    description_zh?: string | null;
}
export interface KnownEntry {
    name: string;
    category: string;
    npm?: string | null;
    description?: {
        en?: string;
        zh?: string;
    };
    added?: string;
}
export type KnownMap = Record<string, KnownEntry>;
export interface MarketEntry {
    name: string;
    owner: string;
    url: string;
    category: string;
    description: string;
    /** 各语言简介（索引富化的 README.<lang> 首段）；缺失语言回退英文。 */
    descriptions?: Record<string, string> | null;
    /** null when the repo came from the HTML crawl and search never covered it. */
    stars: number | null;
    /** Star delta since the last snapshot; null when no baseline exists. */
    todayStars: number | null;
    created: string | null;
    pushed: string | null;
    /** true = verified plugin, false = verified non-plugin, null = unknown. */
    isPlugin: boolean | null;
    /** Listed in the awesome-dsh-plugin curated catalog. */
    curated: boolean;
    npm: string | null;
    avatar: string;
    language: string | null;
    /** npm registry latest version (索引 npm_version)；更新检测数据源。 */
    npmVersion: string | null;
    /** repo 根 package.json 的 version（索引 version 字段）。 */
    version: string | null;
    /** 仓库默认分支；详情面板拉取 README 用。 */
    defaultBranch: string | null;
    /** SPDX license id（索引 license 字段）。 */
    license: string | null;
    /** qing3a/dsh-plugin-verify 验证证据；null = 未验证。 */
    verified: {
        by: string;
        at: string;
        reportUrl: string | null;
    } | null;
    /** 合规披露（cloud/network/offlineMode/apiKeys/jurisdiction/retention）；null = 未披露。 */
    disclosure: {
        cloud: string | null;
        network: string | null;
        offlineMode: boolean | null;
        apiKeys: string[] | null;
        jurisdiction: string | null;
        retention: string | null;
    } | null;
    /** 可安装性判定：non-plugin / manual（手工安装）/ null（未判定）。 */
    installable: 'non-plugin' | 'manual' | null;
    /** GitHub topics（详情面板展示）。 */
    topics: string[];
    /** npm 下载量（近 30 天，npm API 按需富化）；undefined=未拉取，null=未发布。 */
    downloads?: number | null;
    /** npm 总下载量（2019 起累计，按需富化）。 */
    totalDownloads?: number | null;
    /** GitHub Releases latest 版本号（按需富化；npm 未发布的仓库用）。 */
    repoVersion?: string | null;
    /** 黑名单/剔除条目（v1.7.22，exclusions.json）：kind=excluded 非插件或蹭 topic、
     *  market=市场目录本身、leaderboard=不进榜单但可见；reason=公开剔除理由。 */
    excluded?: {
        kind: 'excluded' | 'market' | 'leaderboard';
        reason: string;
    } | null;
    /** v1.7.23+：dsh.bundle 全树扫描结论（机器可安装性）；null=未扫描。 */
    bundled?: boolean | null;
    /** v1.7.23+：扫描批次时间（ISO）。 */
    bundledAt?: string | null;
    /** v1.7.23+：registry 包 repository 字段是否回指本仓库（防抢注）；null=未校验。 */
    npmLinked?: boolean | null;
    /** v1.7.23+：pushed_at 距今超过 180 天（腐烂信号）。 */
    dormant?: boolean | null;
}
export interface Registry {
    updated: string;
    count: number;
    source: 'cdn' | 'live' | 'cache' | 'snapshot';
    categories: Record<string, {
        en: string;
        zh: string;
    }>;
    plugins: MarketEntry[];
}
export interface StarsSnapshot {
    date: string;
    stars: Record<string, number>;
}
export interface MarketState {
    starsSnapshot?: StarsSnapshot;
    /** owner/repo -> verdict from package.json deep-check. */
    verdicts: Record<string, boolean>;
    /** 收藏条目（小写 owner/repo 或 local:包名），持久化在 profile 的 dsh-store/state.json。 */
    favorites?: string[];
    /** 更新前快照（包名 → 旧 spec/版本），「回退到上个版本」数据源。 */
    rollbacks?: Record<string, RollbackEntry>;
    /** 「不参与一键更新」的包名列表。 */
    skipUpdates?: string[];
    /** 自动一键更新（开关 + 最近一次运行结果），持久化在 state.json。 */
    autoUpdate?: {
        enabled: boolean;
        lastRunAt: string | null;
        lastUpdated: number;
        lastMessage: string | null;
    };
    /** npm 下载量缓存：包名 → {at, value}（value null = 未发布）。 */
    downloads?: Record<string, {
        at: number;
        value: number | null;
    }>;
    /** GitHub Releases latest 版本缓存：owner/repo → {at, value}。 */
    repoVersions?: Record<string, {
        at: number;
        value: string | null;
    }>;
    /** find 工具结果暂存（token → payload）：跟随 session 生命周期（不再 30 分钟过期），
     *  持久化在 state.json，宿主重启不丢；上限 20 条（超出丢最旧）。 */
    findResults?: Record<string, {
        at: number;
        payload: unknown;
    }>;
}
export interface InstallState {
    active: boolean;
    kind: 'install' | 'uninstall' | 'update' | null;
    phase: string | null;
    target: string | null;
    line: string | null;
    startedAt: number | null;
    lastResult: {
        ok: boolean;
        message: string;
    } | null;
}
export interface RefreshProgress {
    running: boolean;
    shard: number;
    shards: number;
    repos: number;
    lastError: string | null;
}
export interface MarketConfig {
    profile: string;
    githubToken: string;
    /** Custom registry source URL (registry.json format); empty = default CDN index. */
    registryUrl: string;
}
/** 已装插件激活状态（借鉴 dshmarket 的激活状态模型，按其语义精简）。 */
export type PluginState = 'live' | 'disabled' | 'restart';
/** 回退快照：更新前记录的旧版本信息，供「回退到上个版本」恢复。 */
export interface RollbackEntry {
    name: string;
    from: string;
    to: string;
    spec: string;
    at: string;
}
