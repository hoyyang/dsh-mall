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
export declare function fetchSanitizedReadme(repo: string, file: string, branch: string): Promise<{
    ok: boolean;
    text: string;
}>;
