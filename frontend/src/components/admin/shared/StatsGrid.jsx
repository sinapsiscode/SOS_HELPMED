import React from 'react'
import { useStatsGrid } from '../../../hooks/useStatsGrid'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.shared.statsGrid.comments.title}
 * ${LABELS.admin.shared.statsGrid.comments.approach}
 * ${LABELS.admin.shared.statsGrid.comments.logic}
 * ${LABELS.admin.shared.statsGrid.comments.optimization}
 * ${LABELS.admin.shared.statsGrid.comments.size}
 *
 * @param {Array} stats - Array de estadísticas a mostrar
 */
const StatsGrid = React.memo(({ stats }) => {
  // ============================================
  // HOOK - Toda la lógica está aquí
  // ============================================
  const { grid, stats: processedStats, emptyState, hasStats } = useStatsGrid(stats)

  // ============================================
  // RENDER CONDICIONAL - Estado vacío
  // ============================================
  if (emptyState.visible) {
    return <div className={emptyState.className}>{emptyState.message}</div>
  }

  // ============================================
  // RENDER - Solo template, sin lógica
  // ============================================
  return (
    <div className={grid.className}>
      {processedStats.map((stat) => (
        <div key={stat.key} className={stat.containerClasses}>
          <div className={stat.layout.wrapper}>
            <div>
              <p className={stat.title.className}>{stat.title.text}</p>
              <p className={stat.value.className}>{stat.value.text}</p>
              {stat.subtitle.visible && (
                <p className={stat.subtitle.className}>{stat.subtitle.text}</p>
              )}
            </div>
            <div className={stat.icon.className}>{stat.icon.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
})

StatsGrid.displayName = 'StatsGrid'

export default StatsGrid
