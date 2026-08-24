/**
 * 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧版（140px）+ 详情页评分卡版（184px）。只渲染雷达，不渲染条状图。
 * v1.7.51：标签（名称+分数）整体推到最外层网格线（1.0r）之外——
 * 标签文字框离圆心最近点 ≥ r+2px（几何验算），任何字都不再压灰线/蓝边。
 */
import type { ScoreView } from './market-data.ts'

export type RadarDim = 'maintain' | 'practical' | 'popularity' | 'ease' | 'signal'
const ORDER: RadarDim[] = ['maintain', 'practical', 'popularity', 'ease', 'signal']

interface Props {
  breakdown: ScoreView['breakdown']
  total: number | null
  size?: number
  labels: Record<RadarDim, string>
  totalLabel: string
}

export default function RadarChart({ breakdown, total, size = 140, labels, totalLabel }: Props) {
  const small = size < 150
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.26
  const labelR = 1.56
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

  return (
    <div className="pcm-radar" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} aria-label={totalLabel} style={{ overflow: 'visible' }}>
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
            <text key={k} x={x.toFixed(1)} y={(y + (small ? 2.8 : 3.4)).toFixed(1)} textAnchor="middle" className="pcm-radar-label" fontSize={font}>
              {labels[k] + ' '}
              <tspan className="pcm-radar-val" fontWeight={700} fontSize={small ? 8 : 11}>{breakdown[k] === null ? '—' : String(breakdown[k])}</tspan>
            </text>
          )
        })}
        <text x={cx} y={cy - (small ? 2.5 : 3)} textAnchor="middle" className="pcm-radar-total" fontSize={small ? 16 : 22}>
          {total === null ? '—' : String(total)}
        </text>
        <text x={cx} y={cy + (small ? 11 : 14)} textAnchor="middle" className="pcm-radar-total-label" fontSize={small ? 8 : 10}>
          {totalLabel}
        </text>
      </svg>
    </div>
  )
}
