/**
 * README 安全预渲染（v1.7.26，R7）：host 端清洗后下发，详情面板消费。
 * - 图片域名白名单：raw/camo/user-images/avatars.githubusercontent.com、github.com；
 *   白名单外图片（第三方图床/跟踪像素）移除并留占位说明。
 * - 剥离 <script>/<style> 与其余原始 HTML（标题/段落/换行转 Markdown）。
 * - 标题降级（H1→H2…，详情面板内不出现超大标题）。
 * - 相对链接/图片改 absolute（raw 或 github blob），MarkdownText 可渲染。
 * - 24h 内存缓存；仓库/文件名严格白名单（防路径穿越）。
 */
/** 原始 README（不做任何清洗）：评分/安装命令解析用；24h 缓存。 */
export declare function fetchRawReadme(repo: string, file: string, branch: string): Promise<{
    ok: boolean;
    text: string;
}>;
/** 某语言 README 的候选文件名（与客户端/富化同表）。 */
export declare function readmeCandidates(lang: string): string[];
/** v1.7.89：并行探测某语言 README——候选文件同时抓（各 15s 超时、24h 缓存），
 *  第一个命中的返回。串行逐文件抓在慢链路上最坏要 5×15s，详情页就卡在
 *  「正在加载 README…」很久。 */
export declare function probeReadme(repo: string, lang: string, branch: string): Promise<{
    ok: boolean;
    text: string;
    file: string;
}>;
export declare function fetchSanitizedReadme(repo: string, file: string, branch: string): Promise<{
    ok: boolean;
    text: string;
}>;
/** 安全清洗（v1.7.89 抽出复用：lang 探测路径与单文件路径共用同一清洗管线）。 */
export declare function sanitizeMarkdown(md: string, repo: string, safeBranch: string): string;
