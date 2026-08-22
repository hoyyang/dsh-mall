/**
 * headless AI 调用助手（v1.7.17+）：智能搜索 / 智能安装 / 智能更新 / 智能卸载
 * 共用的 dsh --profile headless 通道。
 *
 * 兼容性（v1.7.17 问题背景）：全局 settings.yaml 的 agent-default-model.provider
 * 可能是只在 web 运行时注册的 provider（如 vision-router 的 deepseek-vision），
 * headless profile 里没有对应适配器 → dsh 报 NO_ADAPTER（且退出码仍为 0）。
 * 此外其他用户的机器可能没有 dsh CLI、或配置了别的 provider。
 *
 * 策略：
 * 1) 解析 dsh 可执行文件（PATH + 常见安装目录），找不到直接降级（调用方走常规路径）；
 * 2) 首选按用户原配置跑；
 * 3) 输出含 NO_ADAPTER 时按候选 provider 依次降级重试：deepseek-official
 *    （llm-deepseek 注册）+ llm-pi-ai providers 里的第一个 provider，各取
 *    models 里的 pro/末位模型；全部失败则返回原始结果，调用方降级常规路径。
 * 4) 支持 AbortSignal（任务面板「取消」）。临时 settings/patch 用完即删。
 */
export declare function runHeadlessTask(task: string, timeoutMs: number, signal?: AbortSignal): Promise<{
    ok: boolean;
    output: string;
}>;
