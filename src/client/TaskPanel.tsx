/**
 * 进行中任务面板（参考 dshmarket OperationsPanel 的交互思路）：
 * - 入口按钮「查看进行中任务」在品牌卡「刷新」右侧；
 * - 面板锚定在按钮下方（fixed 定位），Esc / 点击外部关闭；
 * - 运行中显示聚合进度条（已完成/总数）；失败自动打开面板；
 * - 单条记录：动词 + 名称 + 状态行；完成的记录可单条移除或「清空已完成」。
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconCheckOutline16, IconCloseOutline16, IconLoadingOutline16, IconWarningOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import { taskSummary, type TaskRecord } from './tasks.ts'

export function TaskPanel(props: {
  t: (key: string) => string
  records: readonly TaskRecord[]
  open: boolean
  anchor: HTMLElement | null
  onClose: () => void
  onClearSettled: () => void
  onDismiss: (id: string) => void
}) {
  const { t, records, open } = props
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!open || props.anchor === null) return
    const update = () => {
      const rect = props.anchor!.getBoundingClientRect()
      const width = 380
      const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8))
      setPos({ top: rect.bottom + 6, left })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, props.anchor])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') props.onClose() }
    const onPointer = (e: MouseEvent) => {
      const pop = popRef.current
      if (pop !== null && !pop.contains(e.target as Node)) props.onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open, props])

  if (!open) return null
  const summary = taskSummary(records)
  const busy = summary.running > 0
  const verb = (record: TaskRecord): string =>
    record.kind === 'install' ? t('taskKindInstall')
      : record.kind === 'update' ? t('taskKindUpdate')
        : record.kind === 'uninstall' ? t('taskKindUninstall')
          : record.kind === 'smart-install' ? t('taskKindSmartInstall')
            : t('taskKindSmartUninstall')

  return createPortal(
    <div
      ref={popRef}
      className="pcm-tasks-pop"
      style={pos !== null ? { top: pos.top, left: pos.left } : { top: 80, left: '50%', transform: 'translateX(-50%)' }}
      role="dialog"
      aria-label={t('tasksPanelTitle')}
    >
      <div className="pcm-tasks-head">
        <span className="pcm-tasks-head-title">{t('tasksPanelTitle')}</span>
        {summary.settled > 0 && (
          <Button variant="ghost" size="sm" onClick={props.onClearSettled}>{t('tasksClear')}</Button>
        )}
        <Button variant="ghost" size="sm" icon={<IconCloseOutline16 size={14} />} onClick={props.onClose} title={t('close')} />
      </div>
      <div className="pcm-tasks-body">
        {busy && (
          <>
            <div className="pcm-tasks-agg">
              <span className="pcm-spin"><IconLoadingOutline16 size={13} /></span>
              {t('tasksAggregate').replace('{0}', String(summary.settled)).replace('{1}', String(summary.total))}
            </div>
            <div className="pcm-tasks-bar">
              <div className="pcm-tasks-bar-fill" style={{ width: Math.round(summary.settled / Math.max(1, summary.total) * 100) + '%' }} />
            </div>
          </>
        )}
        {records.length === 0 && (
          <div className="pcm-tasks-empty">
            <div>{t('tasksEmpty')}</div>
            <div className="pcm-tasks-empty-hint">{t('tasksEmptyHint')}</div>
          </div>
        )}
        {records.map(record => (
          <div key={record.id} className="pcm-task-row">
            <span className={'pcm-task-icon ' + (record.state === 'done' ? 'pcm-task-ok' : record.state === 'failed' ? 'pcm-task-bad' : '')}>
              {record.state === 'running' ? (
                <span className="pcm-spin"><IconLoadingOutline16 size={14} /></span>
              ) : record.state === 'done' ? (
                <IconCheckOutline16 size={14} />
              ) : (
                <IconWarningOutline16 size={14} />
              )}
            </span>
            <div className="pcm-task-main">
              <div className="pcm-task-top">
                <span className="pcm-task-verb">{verb(record)}</span>
                <span className="pcm-task-name" title={record.name}>{record.name}</span>
              </div>
              <div className="pcm-task-status">
                {record.state === 'running'
                  ? (record.detail ?? t('taskRunning'))
                  : record.state === 'done'
                    ? (record.detail ?? t('taskDone'))
                    : (record.reason ?? t('taskFailed'))}
              </div>
            </div>
            {record.state !== 'running' && (
              <button type="button" className="pcm-task-x" title={t('tasksDismiss')} onClick={() => props.onDismiss(record.id)}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
