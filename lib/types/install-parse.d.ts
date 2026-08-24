/**
 * README 安装命令解析（v1.7.45，借鉴 2BingLing/dsh-market install-parse.ts，MIT）：
 * 精确命令优先于模板——章节定位（Install/Setup/Getting Started/安装…）
 * → 代码块 + $/# 前缀行提取 → 清洗提示符/注释/前置命令 → 安装命令白名单
 * → 去重最多 3 条 → 章节无果兜底全文 → 全无回退模板（由调用方兜底）。
 * 展示-only：命令只作参考展示，绝不自动执行（供应链安全）。
 */
/** 定位 README 中的安装章节（返回章节文本）。 */
export declare function extractInstallSection(readme: string): string | null;
/** 从安装章节提取安装命令列表（去重，最多 3 条）。 */
export declare function extractInstallCommands(section: string): string[];
/** 综合入口：从 README 提取安装命令。 */
export declare function parseInstallCommands(readme: string | null): {
    commands: string[];
    source: string;
};
export declare function detectNeedsConfig(readme: string | null): boolean;
