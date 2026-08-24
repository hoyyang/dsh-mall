/**
 * 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧紧凑版（100px）+ 详情页评分卡大版（128px）。
 * 只渲染雷达，不渲染条状图。
 * v1.7.47：每个维度的分数直接标在数据顶点旁（清晰可读、深蓝加粗），
 * 轴标签留在外围。
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

export default function RadarChart({ breakdown, total, size = 100, labels, totalLabel }: Props) {
  const small = size < 110
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.3
  const pt = (v: number, i: number): [number, number] => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)]
  }
  const unit = (i: number): [number, number] => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [Math.cos(a), Math.sin(a)]
  }
  const poly = (v: number) =>
    ORDER.map((k, i) => pt(v, i).map(n => n.toFixed(1)).join(',')).join(' ')
  const dataPoly = ORDER.map((k, i) =>
    pt(Math.max(0, (breakdown[k] ?? 0)) / 100, i).map(n => n.toFixed(1)).join(',')
  ).join(' ')

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
          const [ux, uy] = unit(i)
          const off = small ? 8 : 10
          return (
            <g key={k}>
              <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={small ? 1.7 : 2} className="pcm-radar-dot" />
              <text
                x={(x + ux * off).toFixed(1)}
                y={(y + uy * off + (small ? 2 : 2.6)).toFixed(1)}
                textAnchor="middle"
                className="pcm-radar-val"
                fontSize={small ? 6.5 : 8.5}
              >
                {breakdown[k] === null ? '—' : String(breakdown[k])}
              </text>
            </g>
          )
        })}
        {ORDER.map((k, i) => {
          const [x, y] = pt(1.26, i)
          return (
            <text key={k} x={x.toFixed(1)} y={(y + (small ? 3 : 3.6)).toFixed(1)} textAnchor="middle" className="pcm-radar-label" fontSize={small ? 8 : 9}>
              {labels[k]}
            </text>
          )
        })}
        <text x={cx} y={cy - (small ? 2 : 3)} textAnchor="middle" className="pcm-radar-total" fontSize={small ? 16 : 20}>
          {total === null ? '—' : String(total)}
        </text>
        <text x={cx} y={cy + (small ? 11 : 14)} textAnchor="middle" className="pcm-radar-total-label" fontSize={small ? 7.5 : 9}>
          {totalLabel}
        </text>
      </svg>
    </div>
  )
}
