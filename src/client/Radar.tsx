/**
 * 五边形雷达图（v1.7.45，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧紧凑版（~96px）+ 详情页评分卡大版。只渲染雷达，不渲染条状图。
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

export default function RadarChart({ breakdown, total, size = 96, labels, totalLabel }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.357
  const pt = (v: number, i: number): [number, number] => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)]
  }
  const poly = (v: number) =>
    ORDER.map((k, i) => pt(v, i).map(n => n.toFixed(1)).join(',')).join(' ')
  const dataPoly = ORDER.map((k, i) =>
    pt(Math.max(0, (breakdown[k] ?? 0)) / 100, i).map(n => n.toFixed(1)).join(',')
  ).join(' ')

  return (
    <div className="pcm-radar" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} aria-label={totalLabel}>
        {[0.25, 0.5, 0.75, 1].map(v => (
          <polygon key={v} points={poly(v)} className="pcm-radar-grid" />
        ))}
        <polygon points={dataPoly} className="pcm-radar-data" />
        {ORDER.map((k, i) => {
          const [x, y] = pt(Math.max(0, (breakdown[k] ?? 0)) / 100, i)
          return <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={1.8} className="pcm-radar-dot" />
        })}
        {ORDER.map((k, i) => {
          const [x, y] = pt(1.22, i)
          return (
            <text key={k} x={x.toFixed(1)} y={(y + 3).toFixed(1)} textAnchor="middle" className="pcm-radar-label">
              {labels[k]}
            </text>
          )
        })}
        <text x={cx} y={cy - 1} textAnchor="middle" className="pcm-radar-total">
          {total === null ? '—' : String(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="pcm-radar-total-label">
          {totalLabel}
        </text>
      </svg>
    </div>
  )
}
