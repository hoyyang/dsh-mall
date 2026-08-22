/**
 * headless AI 调用助手（v1.7.17）：智能搜索 / 智能安装 / 智能更新 / 智能卸载
 * 共用的 dsh --profile headless 通道。
 *
 * 问题背景：全局 settings.yaml 的 agent-default-model.provider 可能是只在
 * web 运行时注册的 provider（如 vision-router 的 deepseek-vision），headless
 * profile 里没有对应适配器 → dsh 报 NO_ADAPTER（且退出码仍为 0），此前被
 * 误报为「模型调用失败/超时」，智能更新实测踩坑。
 *
 * 修复：首选按用户原配置跑；输出含 NO_ADAPTER 时自动降级——复制 settings.yaml
 * 到临时文件并把 agent-default-model 指向 headless 可用的 deepseek-official
 * （llm-deepseek 注册的 provider，取 models 里的 pro/末位模型），经
 * --patch 覆盖 settings 路径重试一次。用完即删。
 */
export declare function runHeadlessTask(task: string, timeoutMs: number): Promise<{
    ok: boolean;
    output: string;
}>;
