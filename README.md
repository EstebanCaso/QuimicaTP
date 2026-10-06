# 🧪 Tabla Periódica 3D Interactiva

Aplicación web interactiva para el aprendizaje y exploración avanzada de la Química, desarrollada con **React 19**, **Three.js**, **React Three Fiber**, **TypeScript**, **Zustand**, **Tailwind CSS** y **Vitest**.

Permite explorar los 118 elementos químicos en un espacio tridimensional, examinar la estructura atómica mediante modelos de Bohr y nubes de probabilidad cuántica, seleccionar múltiples elementos con sincronización en la URL, y generar compuestos químicos válidos con triple nomenclatura oficial.

---

## 🚀 Características Principales

### 1. Tabla Periódica 3D (Distribución IUPAC Oficial)
- **118 elementos confirmados:** Desde el Hidrógeno ($Z=1$) hasta el Oganesón ($Z=118$).
- **Distribución espacial clásica:** 7 periodos, 18 grupos, bloques s/p/d/f y series de **Lantánidos** y **Actínidos** separadas abajo con enlaces visuales al periodo 6 y 7.
- **Interacción y Cámara Orbital:** Rotación con ratón, desplazamiento (pan) y zoom suave. Elevación de piezas al pasar el cursor con información en tiempo real (*Hover HUD*).
- **Modos de Vista:**
  - **Modo 3D Orbital:** Exploración espacial en perspectiva libre.
  - **Vista Frontal Plana:** Alineación perpendicular clásica para lectura ágil sin distorsión de ángulo.
  - **Modo 2D Accesible:** Cuadrícula HTML responsiva para dispositivos o navegadores sin aceleración WebGL.
- **Filtros dinámicos:** Por categoría química, por bloque (s, p, d, f) y por estado físico a 25 °C. Los elementos no coincidentes se atenúan suavemente sin desaparecer.

### 2. Selección Múltiple y Persistencia en URL
- Selección ilimitada de elementos mediante clic directo o navegación por teclado.
- **Barra de selección flotante:** Visualización de fichas removibles (*chips*) y botón de limpieza inmediata.
- **Sincronización bidireccional con la URL:** Parámetro `?el=H,O,Na` para guardar enlaces, recargar la página o compartir selecciones exactas.

### 3. Ficha Técnica y Regla Estricta de Datos Faltantes
- Información completa: Nombres en español e inglés, número atómico, masa, periodo, grupo, bloque, categoría, configuración electrónica, electronegatividad (Pauling), radio atómico, afinidad electrónica, energía de ionización, puntos de fusión y ebullición, densidad y estados de oxidación.
- **Regla estricta para elementos superpesados ($Z \ge 104$):**
  - **NO se muestra "N/A" ni se inventan propiedades macroscópicas.**
  - Se despliega la sección destacada **Historia de Síntesis Nuclear**: laboratorio de descubrimiento (JINR Dubná, RIKEN, GSI Darmstadt, LLNL), año, ecuación nuclear de síntesis (e.g., $^{249}\text{Cf} + ^{48}\text{Ca} \to ^{294}\text{Og} + 3\text{n}$), vida media de decaimiento alfa o fisión espontánea, etimología del nombre y la justificación científica de por qué no se pueden medir propiedades macroscópicas convencionales (producción átomo a átomo). Las predicciones teóricas se marcan expresamente como `(predicción teórica)`.

### 4. Modelo 3D del Átomo
- **Núcleo atómico:** Agrupamiento denso de protones (azul) y neutrones (gris pizarra), instanciado para mantener 60 FPS incluso en elementos superpesados.
- **Capas de Bohr (Energía Cuántica):** Anillos orbitales concéntricos (niveles K, L, M, N, O, P, Q) con la cantidad exacta de electrones según la configuración fundamental del elemento.
- **Nube de Probabilidad Cuántica:** Modo alternativo que representa la densidad de probabilidad electrónica $|\psi|^2$ mediante partículas orbitales tridimensionales.
- **Controles del átomo:** Pausar/reanudar rotación, ocultar/mostrar anillos orbitales y conmutador entre Bohr y Nube cuántica.

### 5. Motor Químico de Compuestos y Triple Nomenclatura
- **Balance de cargas por cruce de valencias:** Cálculo de subíndices simplificados por Máximo Común Divisor (MCD):
  $$\text{Fe}^{3+} + \text{O}^{2-} \to \text{Fe}_2\text{O}_3 \quad (\text{trióxido de dihierro})$$
  $$\text{Fe}^{2+} + \text{O}^{2-} \to \text{FeO} \quad (\text{monóxido de hierro})$$
- **Compuestos ternarios:** Generación de **hidróxidos** ($\text{NaOH}$, $\text{Ca(OH)}_2$, $\text{Fe(OH)}_3$), **oxoácidos** ($\text{H}_2\text{SO}_4$, $\text{HNO}_3$, $\text{H}_2\text{CO}_3$, $\text{H}_3\text{PO}_4$) y **oxisales** ($\text{CaCO}_3$, $\text{Na}_2\text{SO}_4$, $\text{KNO}_3$).
- **Triple Nomenclatura:**
  1. **Sistemática (IUPAC):** Con prefijos numerales griegos (*mono-, di-, tri-, tetra-, penta-...*).
  2. **Stock:** Con números romanos en paréntesis para elementos con valencias múltiples.
  3. **Tradicional:** Sufijos y prefijos clásicos (*-oso, -ico, hipo-...-oso, per-...-ico*), con raíces etimológicas en latín (*férrico, cuproso, plumboso, áurico*).
  4. **Nombres comunes:** *Agua, agua oxigenada, amoníaco, metano*, etc.
- **Rigor químico:** Identificación de mezclas metálicas puras como **aleaciones/intermetálicos** (sin forzar estequiometrías ficticias) y explicación pedagógica de la **inercia química de gases nobles**.
- Botón interactivo de copia de fórmula al portapapeles con confirmación visual.

### 6. Diseño Visual Minimalista Estricto
- Fondo claro y limpio (`#FAFAFA` / `#FFFFFF`).
- **PROHIBIDOS los gradientes:** Botones y componentes 100% planos, con bordes de 1px y esquinas suavemente redondeadas.
- Paleta cromática plana de tonos pastel suaves desaturados para codificar las categorías químicas sin saturar la vista.
- Accesibilidad WCAG AA, contraste alto y soporte para navegación con teclado.

---

## 📦 Instalación y Ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior (probado con v22).
- npm v9 o superior.

### Instalación de dependencias
```bash
npm install
```

### Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173/`.

### Ejecutar las pruebas unitarias
```bash
npm test
```
Ejecuta la suite de **40 pruebas unitarias con Vitest**, validando el balance de cargas estequiométrico, la reducción de fórmulas y la nomenclatura de más de 35 compuestos químicos emblemáticos.

### Compilar para producción
```bash
npm run build
```
Genera los archivos estáticos optimizados en la carpeta `dist/`, listos para desplegar en Vercel, Netlify o GitHub Pages.

### Análisis estático de código (linter)
```bash
npm run lint
```

---

## 📁 Estructura del Código

```text
quimicaFP/
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── data/
│   │   ├── elements.json             # 118 elementos con datos normalizados en ES y EN
│   │   ├── history.json              # Datos históricos y síntesis de elementos superpesados (Z=104 a 118)
│   │   ├── oxidation-states.json     # Diccionario de números de oxidación
│   │   └── polyatomic-ions.json      # Iones poliatómicos para formulación ternaria
│   ├── domain/                       # Lógica pura desacoplada (sin React ni Three.js)
│   │   ├── chemistry-types.ts        # Interfaces y tipos de dominio
│   │   ├── elements/
│   │   │   ├── element-repository.ts # Búsquedas, filtros y metadatos
│   │   │   ├── electron-config.ts    # Desglose de capas K a Q y configuración cuántica
│   │   │   └── element-metadata.ts   # Paleta pastel plana y coordenadas IUPAC
│   │   └── compounds/
│   │       ├── balance.ts            # Balance de cargas, MCD/MCM y subíndices Unicode
│   │       ├── classify.ts           # Clasificación iónica, covalente e intermetálica
│   │       ├── nomenclature.ts       # Generador de nombres IUPAC, Stock y Tradicional
│   │       ├── ternary-engine.ts     # Hidróxidos, oxoácidos y oxisales
│   │       ├── generator.ts          # Orquestador del motor de compuestos
│   │       └── __tests__/            # Suite de pruebas con Vitest
│   ├── store/
│   │   └── usePeriodicStore.ts       # Estado central Zustand (selección, filtros, vista)
│   ├── hooks/
│   │   ├── useUrlSelection.ts        # Sincronización con parámetro ?el= en la URL
│   │   ├── useMediaQuery.ts          # Soporte responsivo para móvil y escritorio
│   │   └── useWebGLSupport.ts        # Detección de aceleración WebGL con fallback a 2D
│   ├── components/
│   │   ├── ui/                       # Botones planos sin gradientes, chips y pestañas
│   │   ├── scene/                    # ElementTile3D, PeriodicTable3D, PeriodicScene, Vista 2D
│   │   ├── atom/                     # Nucleus, ElectronShells, OrbitalCloud, AtomCanvas
│   │   └── panels/                   # SelectionBar, FilterBar, ElementInfoPanel, CompoundsPanel
│   ├── styles/
│   │   └── tokens.css                # Paleta pastel y tokens de diseño plano
│   ├── App.tsx
│   └── main.tsx
```

---

## 📚 Fuentes de Datos y Referencias Bibliográficas

1. **IUPAC (International Union of Pure and Applied Chemistry):**
   - *Periodic Table of the Elements* (actualizaciones 2018-2024).
   - Nombres oficiales confirmados para los elementos transactínidos: Nihonio (113, Nh), Flerovio (114, Fl), Moscovio (115, Mc), Livermorio (116, Lv), Teneso (117, Ts) y Oganesón (118, Og).
   - Normas de la *IUPAC Red Book* (Nomenclatura de Química Inorgánica).
2. **NIST (National Institute of Standards and Technology):**
   - *Physical Reference Data & Ground Levels and Ionization Energies for the Neutral Atoms*.
3. **Bowserinator/Periodic-Table-JSON:**
   - Estructura base de datos abierta y verificada con datos termodinámicos y atómicos.
4. **Laboratorios de Síntesis Nuclear:**
   - *JINR (Joint Institute for Nuclear Research, Dubná, Rusia)*: Flerov Laboratory of Nuclear Reactions.
   - *RIKEN Nishina Center for Accelerator-Based Science (Wako, Japón)*: Síntesis del Nihonio.
   - *GSI Helmholtzzentrum für Schwerionenforschung (Darmstadt, Alemania)*: Síntesis de Bohrio, Hassio, Meitnerio, Darmstadtio, Roentgenio y Copernicio.
   - *Lawrence Livermore National Laboratory & Oak Ridge National Laboratory (EE.UU.)*: Colaboración en elementos 114 a 118.

---

## 📄 Licencia

Proyecto académico abierto desarrollado con fines pedagógicos y educativos para el curso final de Química.
