// Utilidades para conversión de moneda CLP a PEN
// Tasa de conversión aproximada: 1 CLP = 0.0043 PEN (actualizada 2024)

export const CURRENCY_CONFIG = {
  fromCurrency: 'CLP',
  toCurrency: 'PEN',
  exchangeRate: 0.0043, // 1 CLP = 0.0043 PEN
  locale: 'es-PE'
}

// Función para convertir de CLP a PEN
export const convertCLPtoPEN = (clpAmount) => {
  const penAmount = clpAmount * CURRENCY_CONFIG.exchangeRate
  return Math.round(penAmount * 100) / 100 // Redondear a 2 decimales
}

// Función para formatear moneda peruana
export const formatPEN = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

// Conversiones de precios comunes
export const CONVERTED_PRICES = {
  // Planes familiares
  HELP_MONTHLY: convertCLPtoPEN(15000), // ~65 PEN
  HELP_QUARTERLY: convertCLPtoPEN(40000), // ~172 PEN
  HELP_ANNUALLY: convertCLPtoPEN(150000), // ~645 PEN

  BASICO_MONTHLY: convertCLPtoPEN(35000), // ~151 PEN
  BASICO_QUARTERLY: convertCLPtoPEN(95000), // ~409 PEN
  BASICO_ANNUALLY: convertCLPtoPEN(350000), // ~1,505 PEN

  VIP_MONTHLY: convertCLPtoPEN(65000), // ~280 PEN
  VIP_QUARTERLY: convertCLPtoPEN(180000), // ~774 PEN
  VIP_ANNUALLY: convertCLPtoPEN(650000), // ~2,795 PEN

  DORADO_MONTHLY: convertCLPtoPEN(95000), // ~409 PEN
  DORADO_QUARTERLY: convertCLPtoPEN(270000), // ~1,161 PEN
  DORADO_ANNUALLY: convertCLPtoPEN(950000), // ~4,085 PEN

  // Servicios adicionales
  URGENCIA: convertCLPtoPEN(85000), // ~366 PEN
  MEDICO_DOMICILIO: convertCLPtoPEN(95000), // ~409 PEN
  TRASLADO_PROGRAMADO: convertCLPtoPEN(120000), // ~516 PEN
  ZONA_PROTEGIDA: convertCLPtoPEN(150000), // ~645 PEN

  // Planes corporativos
  CORPORATE_BASIC: convertCLPtoPEN(250000), // ~1,075 PEN
  CORPORATE_PREMIUM: convertCLPtoPEN(450000), // ~1,935 PEN
  CORPORATE_ENTERPRISE: convertCLPtoPEN(180000), // ~774 PEN

  // Servicios externos
  EXTERNAL_EMERGENCY: convertCLPtoPEN(120000), // ~516 PEN
  EXTERNAL_HOME_VISIT: convertCLPtoPEN(95000), // ~409 PEN
  EXTERNAL_ADDITIONAL: convertCLPtoPEN(45000), // ~194 PEN

  // Coberturas de seguro
  BASIC_COVERAGE: convertCLPtoPEN(50000000), // ~215,000 PEN
  PREMIUM_COVERAGE: convertCLPtoPEN(100000000) // ~430,000 PEN
}

// Precios redondeados para mejor presentación
export const ROUNDED_PRICES = {
  // Planes familiares (redondeados a números más amigables)
  HELP_MONTHLY: 65,
  HELP_QUARTERLY: 170,
  HELP_ANNUALLY: 650,

  BASICO_MONTHLY: 150,
  BASICO_QUARTERLY: 410,
  BASICO_ANNUALLY: 1500,

  VIP_MONTHLY: 280,
  VIP_QUARTERLY: 775,
  VIP_ANNUALLY: 2800,

  DORADO_MONTHLY: 410,
  DORADO_QUARTERLY: 1160,
  DORADO_ANNUALLY: 4100,

  // Servicios adicionales
  URGENCIA: 365,
  MEDICO_DOMICILIO: 410,
  TRASLADO_PROGRAMADO: 515,
  ZONA_PROTEGIDA: 645,

  // Planes corporativos
  CORPORATE_BASIC: 1075,
  CORPORATE_PREMIUM: 1935,
  CORPORATE_ENTERPRISE: 775,

  // Servicios externos
  EXTERNAL_EMERGENCY: 515,
  EXTERNAL_HOME_VISIT: 410,
  EXTERNAL_ADDITIONAL: 195,

  // Coberturas de seguro
  BASIC_COVERAGE: 215000,
  PREMIUM_COVERAGE: 430000
}

export default {
  CURRENCY_CONFIG,
  convertCLPtoPEN,
  formatPEN,
  CONVERTED_PRICES,
  ROUNDED_PRICES
}
