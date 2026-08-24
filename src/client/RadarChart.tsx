/**
 * 五边形雷达图（v1.7.45 引入，借鉴 2BingLing/dsh-market RadarChart，MIT）：
 * 卡片右侧版（120px）+ 详情页评分卡版（140px）。只渲染雷达，不渲染条状图。
 * v1.7.49：两行式标注——维度名一行（灰）+ 分数一行（深蓝加粗），分数固定在
 * 维度名正下方；标签半径 1.10/1.38 拉开与五边形边线的间距（此前 1.16/1.32
 * 文字贴边线被误读为"被图挡"）；画布 100→120（详情 128→140）增大留白。
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

export default function RadarChart({ breakdown, total, size = 120, labels, totalLabel }: Props) {
  const small = size < 128
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.28
  const pt = (v: number, i: number): [number, number] => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return [cx + r * v * Math.cos(a), cy + r * v * Math.sin(a)]
  }
  const poly = (v: number) =>
    ORDER.map((k, i) => pt(v, i).map(n => n.toFixed(1)).join(',')).join(' ')
  const dataPoly = ORDER.map((k, i) =>
    pt(Math.max(0, (breakdown[k] ?? 0)) / 100, i).map(n => n.toFixed(1)).join(',')
  ).join(' ')

  const nameFont = small ? 7.5 : 9.5
  const valFont = small ? 8 : 10.5
  const nameR = 1.05
  const valR = 1.59

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
          return <circle key={k} cx={x.toFixed(1)} cy={y.toFixed(1)} r={small ? 1.6 : 2} className="pcm-radar-dot" />
        })}
        {ORDER.map((k, i) => {
          // 维度名与分数上下两行：名称在内圈（1.10r）、分数在外圈（1.38r），
          // 两行基线相差约 0.28r ≈ 10px（120px 画布），互不重叠；
          // 名称与五边形边线（1.0r）间距 0.10r ≈ 3.6px 起，不再贴线。
          const [nx, ny] = pt(nameR, i)
          const [vx, vy] = pt(valR, i)
          return (
            <g key={k}>
              <text x={nx.toFixed(1)} y={(ny + (small ? 2.6 : 3.4)).toFixed(1)} textAnchor="middle" className="pcm-radar-label" fontSize={nameFont}>
                {labels[k]}
              </text>
              <text x={vx.toFixed(1)} y={(vy + (small ? 3 : 3.8)).toFixed(1)} textAnchor="middle" className="pcm-radar-val" fontSize={valFont}>
                {breakdown[k] === null ? '—' : String(breakdown[k])}
              </text>
            </g>
          )
        })}
        <text x={cx} y={cy - (small ? 2.5 : 3)} textAnchor="middle" className="pcm-radar-total" fontSize={small ? 15 : 21}>
          {total === null ? '—' : String(total)}
        </text>
        <text x={cx} y={cy + (small ? 10.5 : 13.5)} textAnchor="middle" className="pcm-radar-total-label" fontSize={small ? 7.5 : 9}>
          {totalLabel}
        </text>
      </svg>
    </div>
  )
}
