/**
 * 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧版（140px）+ 详情页评分卡版（184px）。只渲染雷达，不渲染条状图。
 * v1.7.51：标签（名称+分数）整体推到最外层网格线（1.0r）之外——
 * 标签文字框离圆心最近点 ≥ r+2px（几何验算），任何字都不再压灰线/蓝边。
 * v1.7.70：hover 动效（数据面发光+整体微放大）+ 跟随鼠标的五维规则说明框。
 */
import { useRef, useState } from 'react'
import type { ScoreView } from './market-data.ts'

export type RadarDim = 'maintain' | 'practical' | 'popularity' | 'ease' | 'signal'
const ORDER: RadarDim[] = ['maintain', 'practical', 'popularity', 'ease', 'signal']

interface Props {
  breakdown: ScoreView['breakdown']
  total: number | null
  size?: number
  labels: Record<RadarDim, string>
  totalLabel: string
  /** v1.7.70：悬停说明框语言（人话版五维规则）。 */
  tooltipLang?: 'zh' | 'en'
}

/** 人话版五维规则（言简意赅，跟随鼠标的悬停说明框用）。 */
const RULES: Record<'zh' | 'en', { title: string; dims: Record<RadarDim, string>; total: string }> = {
  zh: {
    title: '五维分数怎么算的',
    dims: {
      maintain: '维护：最近是否还在更新代码、问题多不多',
      practical: '实用：README 有没有安装说明和代码示例',
      popularity: '热度：star / fork 多不多，社区认不认',
      ease: '便捷：能不能一条命令装好、要不要额外配置',
      signal: '信号：许可证 / 简介 / 主题标签全不全',
    },
    total: '综合分 = 五维加权几何平均（乘法融合）——任何一维很低都会强力拉低总分',
  },
  en: {
    title: 'How the five dimensions score',
    dims: {
      maintain: 'Maintain: recently updated, few open issues',
      practical: 'Practical: README has install & usage docs',
      popularity: 'Popularity: stars/forks — community trust',
      ease: 'Ease: one-command install, no extra setup',
      signal: 'Signal: license/description/topics completeness',
    },
    total: 'Composite = weighted geometric mean — one weak dimension pulls it down hard',
  },
}

export default function RadarChart({ breakdown, total, size = 140, labels, totalLabel, tooltipLang = 'zh' }: Props) {
  const small = size < 150
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.26
  const labelR = 1.56
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pt = (v: number, i: number): [number, number] => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)]
  }
  const poly = (v: number) =>
    ORDER.map((k, i) => pt(v, i).map(n => n.toFixed(1)).join(',')).join(' ')
  const dataPoly = ORDER.map((k, i) =>
    pt(Math.max(0, (breakdown[k] ?? 0)) / 100, i).map(n => n.toFixed(1)).join(',')
  ).join(' ')

  const font = small ? 8 : 10
  const rules = RULES[tooltipLang]

  return (
    <div
      className={'pcm-radar' + (tip !== null ? ' pcm-radar-hot' : '')}
      style={{ width: size, height: size }}
      ref={rootRef}
      onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseMove={e => setTip({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setTip(null)}
    >
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} aria-label={totalLabel}>
        {[0.25, 0.5, 0.75, 1].map(v => (
          <polygon key={v} points={poly(v)} className="pcm-radar-grid" />
        ))}
        <polygon points={dataPoly} className="pcm-radar-data" />
        {ORDER.map((k, i) => {
          const v = Math.max(0, (breakdown[k] ?? 0)) / 100
          const [x, y] = pt(v, i)
          return <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={small ? 1.8 : 2.2} className="pcm-radar-dot" />
        })}
        {ORDER.map((k, i) => {
          const [x, y] = pt(labelR, i)
          return (
            <text key={k} x={x.toFixed(1)} y={(y + (small ? 2.8 : 3.4)).toFixed(1)} textAnchor="middle" fontSize={font} className="pcm-radar-label">
              {labels[k] + ' '}
              <tspan className="pcm-radar-val" fontWeight={700} fontSize={small ? 8 : 11}>{breakdown[k] ?? '—'}</tspan>
            </text>
          )
        })}
        <text x={cx} y={cy - (small ? 2.5 : 3)} textAnchor="middle" className="pcm-radar-total" fontSize={small ? 15 : 19}>
          {total === null ? '—' : String(total)}
        </text>
        <text x={cx} y={cy + (small ? 11 : 14)} textAnchor="middle" className="pcm-radar-total-label" fontSize={small ? 8 : 10}>
          {totalLabel}
        </text>
      </svg>
      {tip !== null && (
        <div className="pcm-radar-tip" style={{ left: tip.x + 16, top: tip.y + 14 }}>
          <div className="pcm-radar-tip-title">{rules.title}</div>
          {ORDER.map(k => (
            <div key={k} className="pcm-radar-tip-row">
              <span className="pcm-radar-tip-dim">{labels[k]}</span>
              <span className="pcm-radar-tip-score">{breakdown[k] ?? '—'}</span>
              <span className="pcm-radar-tip-rule">{rules.dims[k]}</span>
            </div>
          ))}
          <div className="pcm-radar-tip-total">{rules.total}</div>
        </div>
      )}
    </div>
  )
}
