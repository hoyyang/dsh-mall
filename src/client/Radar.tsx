/**
 * 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧紧凑版（100px）+ 详情页评分卡大版（128px）。
 * 只渲染雷达，不渲染条状图。
 * v1.7.48：每个维度的分数固定显示在维度文字旁边（同一条文字，分数加粗深蓝），
 * 不再放到数据顶点旁（曾与文字重叠）。
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
          return <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={small ? 1.7 : 2} className="pcm-radar-dot" />
        })}
        {ORDER.map((k, i) => {
          // 文字+分数放在轴标签半径（比数据顶点略外），小尺寸/大尺寸分别取 1.18/1.14
          // 防止左右顶点文字溢出画布。
          const [x, y] = pt(small ? 1.18 : 1.14, i)
          return (
            <text key={k} x={x.toFixed(1)} y={(y + (small ? 3 : 3.6)).toFixed(1)} textAnchor="middle" className="pcm-radar-label" fontSize={small ? 8 : 9.5}>
              {labels[k] + ' '}
              <tspan className="pcm-radar-val" fontWeight={700}>{breakdown[k] === null ? '—' : String(breakdown[k])}</tspan>
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
