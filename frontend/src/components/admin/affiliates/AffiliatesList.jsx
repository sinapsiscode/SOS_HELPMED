import React from 'react'
import AffiliateCard from './AffiliateCard'
import { useAffiliatesList } from '../../../hooks/useAffiliatesList'

/**
 * Lista de afiliados
 * COMPONENTE UI PURO - Solo presentación, CERO lógica (Regla #2)
 * Toda la lógica está en useAffiliatesList
 * Optimizado con React.memo (Regla #13)
 * Menos de 200 líneas (Regla #3)
 *
 * @param {Array} affiliates - Lista de afiliados
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onToggleStatus - Callback para cambiar estado
 * @param {Function} onAddFirst - Callback para agregar primer afiliado
 */
const AffiliatesList = React.memo(
  ({ affiliates, onEdit, onDelete, onToggleStatus, onAddFirst }) => {
    // ============================================
    // HOOK - Toda la lógica está aquí
    // ============================================
    const { isEmpty, emptyState, header, stats, gridConfig, affiliateCards, classes } =
      useAffiliatesList(affiliates, onEdit, onDelete, onToggleStatus, onAddFirst)

    // ============================================
    // RENDER CONDICIONAL - Estado vacío
    // ============================================
    if (isEmpty) {
      return (
        <div className={classes.emptyState.container}>
          <div className={classes.emptyState.icon}>{emptyState.icon}</div>
          <h3 className={classes.emptyState.title}>{emptyState.title}</h3>
          <p className={classes.emptyState.description}>{emptyState.description}</p>
          <button onClick={emptyState.button.onClick} className={emptyState.button.className}>
            <span>{emptyState.button.icon}</span>
            <span>{emptyState.button.text}</span>
          </button>
        </div>
      )
    }

    // ============================================
    // RENDER - Lista con afiliados
    // ============================================
    return (
      <div className={classes.container}>
        {/* Header de la lista */}
        <div className={classes.header.wrapper}>
          <div>
            <h3 className={classes.header.title}>{header.title}</h3>
            <p className={classes.header.subtitle}>{header.subtitle}</p>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className={gridConfig.className}>
          {affiliateCards.map((cardProps) => (
            <AffiliateCard {...cardProps} />
          ))}
        </div>

        {/* Estadísticas rápidas */}
        <div className={classes.stats.wrapper}>
          <h4 className={classes.stats.title}>{stats.title}</h4>
          <div className={classes.stats.grid}>
            {stats.items.map((stat) => (
              <div key={stat.id} className={classes.stats.item.container}>
                <div className={`${classes.stats.item.value} ${stat.colorClass}`}>{stat.value}</div>
                <div className={classes.stats.item.label}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

AffiliatesList.displayName = 'AffiliatesList'

export default AffiliatesList
