/**
 * 任务记录模型（参考 dshmarket 的 operations.ts，纯函数可测）：
 * 每次安装/更新/卸载一条记录，从提交到完成都挂在面板上，翻页/筛选
 * 不会把进行中的操作带出视野。批量一键更新记为一条聚合记录。
 */

export type TaskKind = 'install' | 'update' | 'uninstall'
export type TaskState = 'running' | 'done' | 'failed'

export interface TaskRecord {
  /** 稳定 id：面板操作（移除）按它寻址。 */
  id: string
  kind: TaskKind
  /** 展示名：插件名 / 批量更新的聚合名 / dsh-store。 */
  name: string
  state: TaskState
  /** 运行中显示的一行细节（如 from → to）；done 时优先显示 host 消息。 */
  detail?: string | null
  /** failed 时的一句话原因。 */
  reason?: string | null
  at: number
}

export function enqueueTask(list: readonly TaskRecord[], record: TaskRecord): TaskRecord[] {
  return [...list, record]
}

export function patchTask(
  list: readonly TaskRecord[],
  id: string,
  changes: Partial<Omit<TaskRecord, 'id'>>,
): TaskRecord[] {
  return list.map(record => (record.id === id ? { ...record, ...changes } : record))
}

export function dismissTask(list: readonly TaskRecord[], id: string): TaskRecord[] {
  return list.filter(record => record.id !== id)
}

export function clearSettledTasks(list: readonly TaskRecord[]): TaskRecord[] {
  return list.filter(record => record.state === 'running')
}

export function taskSummary(list: readonly TaskRecord[]): { running: number; settled: number; total: number } {
  let running = 0
  let settled = 0
  for (const record of list) {
    if (record.state === 'running') running += 1
    else settled += 1
  }
  return { running, settled, total: running + settled }
}
