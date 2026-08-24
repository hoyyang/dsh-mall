/**
 * README 安装命令解析（v1.7.45，借鉴 2BingLing/dsh-market install-parse.ts，MIT）：
 * 精确命令优先于模板——章节定位（Install/Setup/Getting Started/安装…）
 * → 代码块 + $/# 前缀行提取 → 清洗提示符/注释/前置命令 → 安装命令白名单
 * → 去重最多 3 条 → 章节无果兜底全文 → 全无回退模板（由调用方兜底）。
 * 展示-only：命令只作参考展示，绝不自动执行（供应链安全）。
 */
/** 定位 README 中的安装章节（返回章节文本）。 */
export function extractInstallSection(readme) {
    const lines = readme.split(/\r?\n/);
    let start = -1;
    let level = 0;
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^(#{1,4})\s+(.+)$/);
        if (!m)
            continue;
        const lv = m[1].length;
        const title = m[2].toLowerCase();
        if (start < 0) {
            if (/^(install|installation|setup|getting started|quick start|deploy|安装|快速开始|开始使用|使用说明)/.test(title)) {
                start = i;
                level = lv;
            }
        }
        else if (lv <= level) {
            // 遇到同级或更高级标题，章节结束
            return lines.slice(start + 1, i).join('\n');
        }
    }
    return start >= 0 ? lines.slice(start + 1).join('\n') : null;
}
const INSTALL_CMD_RE = /^(git clone|git submodule|git config|dsh plugin|dsh\s+.*\sadd|pnpm (add|i)\b|npm (install|i)\b|npx skills add|npx @[^\s]+ add|curl .*install|pip install|uv (tool )?install|brew install|cargo install|git init|yarn (add|global add))/;
/** 判断是否为安装类命令。 */
function isInstallCmd(cmd) {
    return INSTALL_CMD_RE.test(cmd);
}
/** 清洗单行命令：去提示符/注释/无意义前缀。 */
function cleanCmdLine(line) {
    let c = line.trim();
    c = c.replace(/^[$#>]\s*/, '');
    c = c.replace(/\s*#.*$/, '').trim();
    // 过滤 cd/mkdir/echo 等纯前置命令（不含 && 链的）
    if (/^(cd |mkdir |echo |touch |cat >|ls |rm )/.test(c) && !c.includes('&&'))
        return '';
    return c;
}
/** 从安装章节提取安装命令列表（去重，最多 3 条）。 */
export function extractInstallCommands(section) {
    const cmds = [];
    const push = (line) => {
        const c = cleanCmdLine(line);
        if (c && isInstallCmd(c) && !cmds.includes(c))
            cmds.push(c);
    };
    // 1. 代码块内的行
    for (const m of section.matchAll(/```(?:bash|sh|shell|console|zsh)?\s*\n([\s\S]*?)```/g)) {
        for (const line of m[1].split(/\r?\n/))
            push(line);
    }
    // 2. $ / # 前缀的命令行
    for (const line of section.split(/\r?\n/)) {
        if (/^\s*[$#>]\s*/.test(line))
            push(line);
    }
    return cmds.slice(0, 3);
}
/** 综合入口：从 README 提取安装命令。 */
export function parseInstallCommands(readme) {
    if (!readme)
        return { commands: [], source: 'template' };
    const section = extractInstallSection(readme);
    if (section) {
        const cmds = extractInstallCommands(section);
        if (cmds.length > 0)
            return { commands: cmds, source: 'readme-section' };
    }
    // 兜底：全文找安装命令
    const cmds = extractInstallCommands(readme);
    if (cmds.length > 0)
        return { commands: cmds, source: 'readme' };
    return { commands: [], source: 'template' };
}
/** 检测 README/SKILL 内容中的"需要配置"信号（具体环境变量名），
 *  否定语境（"不需要 API key"等）先摘除避免误报——dsh.market detect.ts 同款。 */
const CONFIG_KEY_RE = /(?:^|[^A-Za-z])(GITHUB_TOKEN|GH_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|DEEPSEEK_API_KEY|LLM_API_KEY|API_KEY|CLAUDE_API_KEY|AZURE_OPENAI|AWS_ACCESS_KEY|STRIPE_API_KEY|WEBHOOK_SECRET|SESSION_KEY)(?:[^A-Za-z]|$)/i;
const NEGATION_RE = /(?:不需要|无需|不用|免[^。；\n]{0,10}(?:配置|token|key)|no (?:api ?key|token|config|setup|configuration)|without (?:any )?(?:api ?key|token|config)|no configuration required|zero-?config|works (?:out of the box|without))/i;
export function detectNeedsConfig(readme) {
    if (!readme)
        return false;
    const text = readme.replace(NEGATION_RE, ' ');
    return CONFIG_KEY_RE.test(text);
}
