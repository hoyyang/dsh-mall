/**
 * 全局任务总线（v1.7.71）：任务记录跨浮窗共享——主商店浮窗与智能搜索结果浮窗
 * 是两个独立的 MarketSection 实例，此前 tasks 是各自组件内的 useState，
 * 从结果浮窗发起的智能安装任务在首页「查看进行中任务」里看不到。
 * 业务逻辑（安装/更新/卸载请求）写这里，任何 UI 实例订阅同一个列表。
 */
import type { TaskRecord } from './tasks.ts'

let tasks: TaskRecord[] = []
let seq = 0
const listeners = new Set<() => void>()

export const taskStore = {
  get(): TaskRecord[] {
    return tasks
  },
  set(next: TaskRecord[]): void {
    tasks = next
    for (const fn of listeners) fn()
  },
  subscribe(fn: () => void): () => void {
    listeners.add(fn)
    return () => { listeners.delete(fn) }
  },
  nextId(): string {
    return 'task-' + String(++seq) + '-' + String(Date.now() % 100000)
  },
}
