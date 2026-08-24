/**
 * v1.7.55 冷启动问卷（对标 dsh.market QuizView）：
 * 没装什么插件时，用 30 秒功能选择建立偏好画像，驱动「为你推荐」。
 * - 全店语言统一走 storeLang（zh/en）
 * - 选中上限 5 个，至少 1 个才能看推荐
 * - 提交 → onComplete(answers: string[]) → host 持久化 state.json + 重新计算推荐
 */

import { useState } from 'react'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'

export interface QuizFeature {
  id: string
  emoji: string
  zh: string
  en: string
}

export const QUIZ_FEATURES: QuizFeature[] = [
  { id: 'vision', emoji: '🔍', zh: '视觉识别', en: 'Vision & OCR' },
  { id: 'files', emoji: '📄', zh: '文件处理', en: 'Files & Docs' },
  { id: 'browser', emoji: '🌐', zh: '浏览器控制', en: 'Browser Control' },
  { id: 'notify', emoji: '🔔', zh: '通知推送', en: 'Notifications' },
  { id: 'search', emoji: '🔎', zh: '搜索增强', en: 'Search' },
  { id: 'memory', emoji: '🧠', zh: '会话记忆', en: 'Memory' },
  { id: 'devtools', emoji: '🛠️', zh: '开发工具', en: 'DevTools' },
  { id: 'data', emoji: '📊', zh: '数据看板', en: 'Analytics' },
  { id: 'fun', emoji: '🎮', zh: '游戏娱乐', en: 'Fun & Games' },
  { id: 'theme', emoji: '🎨', zh: '皮肤主题', en: 'Themes' },
  { id: 'voice', emoji: '🎙️', zh: '语音音频', en: 'Voice & Audio' },
  { id: 'imagegen', emoji: '🖼️', zh: '图像生成', en: 'Image Gen' },
  { id: 'agent', emoji: '🤖', zh: '智能体', en: 'Agents' },
  { id: 'security', emoji: '🛡️', zh: '安全审计', en: 'Security' },
]

export function QuizView(props: {
  open: boolean
  lang: string
  t: (key: string) => string
  onClose: () => void
  onComplete: (answers: string[]) => void
}) {
  const [picked, setPicked] = useState<string[]>([])
  const zh = props.lang === 'zh'
  const MAX = 5
  const toggle = (id: string) => {
    setPicked(prev => prev.includes(id) ? prev.filter(x => x !== id) : (prev.length >= MAX ? prev : [...prev, id]))
  }
  return (
    <Modal open={props.open} onClose={props.onClose} title="DSH Store" headless className="pcm-quiz-modal">
      <div className="pcm-quiz">
        <div className="pcm-quiz-head">
          <div className="pcm-quiz-badge">{props.t('quizBadge')}</div>
          <div className="pcm-quiz-title">{props.t('quizTitle')}</div>
          <div className="pcm-quiz-sub">{props.t('quizSub')}</div>
        </div>
        <div className="pcm-quiz-body">
          <div className="pcm-quiz-count">
            {props.t('quizPicked')} <b>{picked.length}</b>/{MAX}
          </div>
          <div className="pcm-quiz-grid">
            {QUIZ_FEATURES.map(f => {
              const on = picked.includes(f.id)
              return (
                <button
                  key={f.id}
                  type="button"
                  className={on ? 'pcm-quiz-chip pcm-quiz-chip-on' : 'pcm-quiz-chip'}
                  onClick={() => toggle(f.id)}
                >
                  <span className="pcm-quiz-emoji">{f.emoji}</span>
                  <span className="pcm-quiz-label">{zh ? f.zh : f.en}</span>
                  {on && (
                    <span className="pcm-quiz-check" aria-hidden="true">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="pcm-quiz-foot">
          <Button variant="ghost" size="sm" onClick={props.onClose}>{props.t('quizSkip')}</Button>
          <Button
            variant="primary"
            size="sm"
            className="pcm-quiz-go"
            disabled={picked.length === 0}
            onClick={() => props.onComplete(picked)}
          >
            {props.t('quizGo')} {picked.length > 0 ? '(' + picked.length + ')' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
