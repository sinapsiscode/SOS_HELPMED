# 📏 Recomendaciones sobre el Tamaño de un Hook

## 🎯 Hazlo pequeño y enfocado

Un hook debería resolver una única responsabilidad clara (ej. manejar un fetch, controlar un formulario, detectar el tamaño de la ventana).

Si empieza a crecer demasiado, probablemente está resolviendo más de una cosa → **toca dividirlo**.

## 📐 Regla práctica

- ✅ **Hasta 30–50 líneas** suele estar bien para un hook "normal"
- ⚠️ **Si pasa de 80–100 líneas**, casi seguro que puedes extraer lógica repetida o secundaria en otros hooks o funciones auxiliares

## 🛠️ Separa helpers de la lógica principal

Si dentro del hook tienes funciones que **no dependen** de `useState`, `useEffect`, etc., sácalas como **funciones utilitarias** (`utils`).

Eso mantiene el hook más limpio y fácil de testear.

## 📖 Legibilidad > número de líneas

- ❌ Un hook puede tener **20 líneas** pero ser un "spaghetti ilegible"
- ✅ Otro puede tener **70 líneas**, pero bien comentado, modular y claro → **y está perfecto**

## 🔹 Señales de que un hook es demasiado grande

1. Tienes varios `useEffect` y `useState` mezclados sin relación clara
2. Es difícil ponerle un nombre que describa bien qué hace
3. Reutilizas solo partes del hook en otros lados (entonces deberían ser hooks separados)

## 👉 Resumen:

- **Ideal:** 30–50 líneas
- **Máximo aceptable:** 80–100 líneas, pero solo si sigue siendo claro
- **Si crece más** → divídelo en hooks más pequeños o helpers