import React from 'react'
import { useAffiliateCard } from '../../../hooks/useAffiliateCard'

/**
 * Tarjeta de afiliado individual
 * COMPONENTE UI PURO - Solo presentación, CERO lógica (Regla #2)
 * Toda la lógica está en useAffiliateCard
 * Optimizado con React.memo (Regla #13)
 * Menos de 200 líneas (Regla #3)
 *
 * @param {Object} affiliate - Datos del afiliado
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onToggleStatus - Callback para cambiar estado
 */
const AffiliateCard = React.memo(({ affiliate, onEdit, onDelete, onToggleStatus }) => {
  // ============================================
  // HOOK - Toda la lógica está aquí
  // ============================================
  const { header, infoRows, actions, classes } = useAffiliateCard(
    affiliate,
    onEdit,
    onDelete,
    onToggleStatus
  )

  // ============================================
  // RENDER - Solo template, sin lógica
  // ============================================
  return (
    <div className={classes.container}>
      {/* Header con nombre y estado */}
      <div className={classes.header.wrapper}>
        <div className={classes.header.leftSection}>
          <div className={classes.header.avatar.container}>
            <span className={classes.header.avatar.icon}>{header.avatarIcon}</span>
          </div>
          <div>
            <h4 className={classes.header.info.name}>{header.name}</h4>
            <p className={classes.header.info.relationship}>{header.relationship}</p>
          </div>
        </div>

        <span className={header.statusBadge.className}>{header.statusBadge.text}</span>
      </div>

      {/* Información detallada */}
      <div className={classes.infoSection.wrapper}>
        {infoRows.map((row) => (
          <div key={row.id} className={classes.infoSection.row.container}>
            <span className={classes.infoSection.row.label}>{row.label}:</span>
            <span className={classes.infoSection.row.value}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className={classes.actions.wrapper}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${classes.actions.button} ${action.className}`}
            title={action.title}
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  )
})

AffiliateCard.displayName = 'AffiliateCard'

export default AffiliateCard
