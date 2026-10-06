const fs = require('fs');
const path = require('path');

// Base definition of all 118 elements
const elementsRaw = [
  {
    num: 1, sym: "H", name: "Hidrógeno", nameEn: "Hydrogen", mass: 1.008, period: 1, group: 1, block: "s",
    category: "reactive-nonmetal", config: "1s¹", shells: [1],
    en: 2.20, radius: 53, ie: 1312, ea: 72.8, mp: -259.16, bp: -252.87, density: 0.00008988, phase: "gas",
    ox: [-1, 1], year: 1766, disc: "Henry Cavendish",
    origin: "Del griego 'hydro' (agua) y 'genes' (creador): generador de agua.",
    summary: "El elemento químico más abundante del universo. Combustible de estrellas y componente fundamental del agua y de la materia orgánica."
  },
  {
    num: 2, sym: "He", name: "Helio", nameEn: "Helium", mass: 4.0026, period: 1, group: 18, block: "s",
    category: "noble-gas", config: "1s²", shells: [2],
    en: null, radius: 31, ie: 2372, ea: 0, mp: -272.2, bp: -268.93, density: 0.0001785, phase: "gas",
    ox: [0], year: 1868, disc: "Pierre Janssen y Norman Lockyer",
    origin: "Del griego 'Helios', dios del Sol, ya que fue detectado por primera vez en el espectro solar.",
    summary: "Gas noble inerte y ligero. Segundo elemento más abundante del cosmos. Utilizado en criogenia médica (resonancia magnética) y globos aerostáticos."
  },
  {
    num: 3, sym: "Li", name: "Litio", nameEn: "Lithium", mass: 6.94, period: 2, group: 1, block: "s",
    category: "alkali-metal", config: "[He] 2s¹", shells: [2, 1],
    en: 0.98, radius: 167, ie: 520, ea: 59.6, mp: 180.54, bp: 1342, density: 0.534, phase: "solid",
    ox: [1], year: 1817, disc: "Johan August Arfwedson",
    origin: "Del griego 'lithos' (piedra), debido a su descubrimiento en minerales sólidos.",
    summary: "El metal menos denso que existe. Clave para la transición energética por su rol central en baterías recargables de iones de litio y fármacos estabilizadores del ánimo."
  },
  {
    num: 4, sym: "Be", name: "Berilio", nameEn: "Beryllium", mass: 9.0122, period: 2, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[He] 2s²", shells: [2, 2],
    en: 1.57, radius: 112, ie: 899, ea: 0, mp: 1287, bp: 2470, density: 1.85, phase: "solid",
    ox: [2], year: 1798, disc: "Louis-Nicolas Vauquelin",
    origin: "Del griego 'beryllos', mineral berilo (esmeralda y aguamarina).",
    summary: "Metal ligero y rígido de alta permeabilidad a los rayos X. Utilizado en componentes aeroespaciales, ventanas de tubos de rayos X y reactores nucleares."
  },
  {
    num: 5, sym: "B", name: "Boro", nameEn: "Boron", mass: 10.81, period: 2, group: 13, block: "p",
    category: "metalloid", config: "[He] 2s² 2p¹", shells: [2, 3],
    en: 2.04, radius: 87, ie: 801, ea: 26.7, mp: 2076, bp: 3927, density: 2.34, phase: "solid",
    ox: [3], year: 1808, disc: "Joseph Louis Gay-Lussac y Louis Jacques Thénard",
    origin: "Del árabe 'buraq' y persa 'burah', nombres antiguos del mineral bórax.",
    summary: "Semimetal semiconductor de gran dureza. Esencial en vidrio borosilicatado (Pyrex), cerámicas resistentes al calor y fertilizantes agrícolas."
  },
  {
    num: 6, sym: "C", name: "Carbono", nameEn: "Carbon", mass: 12.011, period: 2, group: 14, block: "p",
    category: "reactive-nonmetal", config: "[He] 2s² 2p²", shells: [2, 4],
    en: 2.55, radius: 67, ie: 1086, ea: 121.8, mp: 3550, bp: 4827, density: 2.267, phase: "solid",
    ox: [-4, -2, 2, 4], year: "Antigüedad", disc: "Conocido desde tiempos prehistóricos",
    origin: "Del latín 'carbo', carbón vegetal.",
    summary: "Base estructural de toda la química orgánica y de los seres vivos conocidos. Presenta formas alotrópicas fascinantes como el grafito, el diamante y el grafeno."
  },
  {
    num: 7, sym: "N", name: "Nitrógeno", nameEn: "Nitrogen", mass: 14.007, period: 2, group: 15, block: "p",
    category: "reactive-nonmetal", config: "[He] 2s² 2p³", shells: [2, 5],
    en: 3.04, radius: 56, ie: 1402, ea: -7, mp: -210.0, bp: -195.79, density: 0.0012506, phase: "gas",
    ox: [-3, -2, -1, 1, 2, 3, 4, 5], year: 1772, disc: "Daniel Rutherford",
    origin: "Del griego 'nitron' (nitro) y 'genes' (generador): generador de salitre.",
    summary: "Constituye aproximadamente el 78% del volumen de la atmósfera terrestre. Vital en aminoácidos, proteínas, ADN, fertilizantes y procesos de refrigeración criogénica."
  },
  {
    num: 8, sym: "O", name: "Oxígeno", nameEn: "Oxygen", mass: 15.999, period: 2, group: 16, block: "p",
    category: "reactive-nonmetal", config: "[He] 2s² 2p⁴", shells: [2, 6],
    en: 3.44, radius: 48, ie: 1314, ea: 141.0, mp: -218.79, bp: -182.96, density: 0.001429, phase: "gas",
    ox: [-2, -1, 2], year: 1774, disc: "Joseph Priestley y Carl Wilhelm Scheele",
    origin: "Del griego 'oxys' (ácido) y 'genes' (formador), llamado así por Antoine Lavoisier.",
    summary: "Gas diatómico imprescindible para la respiración celular aeróbica y la combustión. Es el elemento más abundante en masa en la corteza terrestre y en los océanos."
  },
  {
    num: 9, sym: "F", name: "Flúor", nameEn: "Fluorine", mass: 18.998, period: 2, group: 17, block: "p",
    category: "halogen", config: "[He] 2s² 2p⁵", shells: [2, 7],
    en: 3.98, radius: 42, ie: 1681, ea: 328.2, mp: -219.67, bp: -188.11, density: 0.001696, phase: "gas",
    ox: [-1], year: 1886, disc: "Henri Moissan",
    origin: "Del latín 'fluere' (fluir), derivado del mineral fluorita usado como fundente.",
    summary: "El elemento químicamente más reactivo y electronegativo de toda la tabla periódica. Presente en teflón (PTFE), dentífricos protectores de esmalte y refrigerantes."
  },
  {
    num: 10, sym: "Ne", name: "Neón", nameEn: "Neon", mass: 20.180, period: 2, group: 18, block: "p",
    category: "noble-gas", config: "[He] 2s² 2p⁶", shells: [2, 8],
    en: null, radius: 38, ie: 2081, ea: 0, mp: -248.59, bp: -246.05, density: 0.0008999, phase: "gas",
    ox: [0], year: 1898, disc: "William Ramsay y Morris Travers",
    origin: "Del griego 'neos' (nuevo).",
    summary: "Gas inerte célebre por su brillante brillo rojo-anaranjado característico en tubos de descarga de iluminación y señalización publicitaria."
  },
  {
    num: 11, sym: "Na", name: "Sodio", nameEn: "Sodium", mass: 22.990, period: 3, group: 1, block: "s",
    category: "alkali-metal", config: "[Ne] 3s¹", shells: [2, 8, 1],
    en: 0.93, radius: 190, ie: 496, ea: 52.8, mp: 97.79, bp: 882.8, density: 0.968, phase: "solid",
    ox: [1], year: 1807, disc: "Humphry Davy",
    origin: "Del latín 'natrium' y del árabe 'suda' (dolor de cabeza curado por carbonato sódico).",
    summary: "Metal alcalino blando muy reactivo con el agua. El ion Na⁺ es el principal catión extracelular, crucial para la transmisión del impulso nervioso y el balance osmótico."
  },
  {
    num: 12, sym: "Mg", name: "Magnesio", nameEn: "Magnesium", mass: 24.305, period: 3, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[Ne] 3s²", shells: [2, 8, 2],
    en: 1.31, radius: 145, ie: 738, ea: 0, mp: 650, bp: 1090, density: 1.738, phase: "solid",
    ox: [2], year: 1755, disc: "Joseph Black",
    origin: "De Magnesia, prefectura en Tesalia, Grecia.",
    summary: "Metal estructural ligero usado en aleaciones aeronáuticas. Es el átomo central del anillo de porfirina en la clorofila vegetal, facilitando la fotosíntesis."
  },
  {
    num: 13, sym: "Al", name: "Aluminio", nameEn: "Aluminium", mass: 26.982, period: 3, group: 13, block: "p",
    category: "post-transition-metal", config: "[Ne] 3s² 3p¹", shells: [2, 8, 3],
    en: 1.61, radius: 118, ie: 578, ea: 42.5, mp: 660.32, bp: 2519, density: 2.70, phase: "solid",
    ox: [3], year: 1825, disc: "Hans Christian Ørsted",
    origin: "Del latín 'alumen', nombre del alumbre mineral.",
    summary: "El metal más abundante en la corteza terrestre. Ligero, resistente a la corrosión mediante su capa de óxido pasivante y excelente conductor eléctrico y térmico."
  },
  {
    num: 14, sym: "Si", name: "Silicio", nameEn: "Silicon", mass: 28.085, period: 3, group: 14, block: "p",
    category: "metalloid", config: "[Ne] 3s² 3p²", shells: [2, 8, 4],
    en: 1.90, radius: 111, ie: 786, ea: 134.1, mp: 1414, bp: 3265, density: 2.329, phase: "solid",
    ox: [-4, 2, 4], year: 1824, disc: "Jöns Jacob Berzelius",
    origin: "Del latín 'silex' (pedernal).",
    summary: "Pilar absoluto de la tecnología moderna y de la microelectrónica gracias a sus propiedades semiconductoras, además de dar origen a minerales de sílice y silicatos."
  },
  {
    num: 15, sym: "P", name: "Fósforo", nameEn: "Phosphorus", mass: 30.974, period: 3, group: 15, block: "p",
    category: "reactive-nonmetal", config: "[Ne] 3s² 3p³", shells: [2, 8, 5],
    en: 2.19, radius: 98, ie: 1012, ea: 72.0, mp: 44.15, bp: 280.5, density: 1.823, phase: "solid",
    ox: [-3, 3, 5], year: 1669, disc: "Hennig Brand",
    origin: "Del griego 'phosphoros' (portador de luz), debido a la quimioluminiscencia del fósforo blanco.",
    summary: "Esencial para todas las formas de vida como componente del esqueleto de ADN, ARN y la molécula energética ATP. Vital en fertilizantes de fosfato."
  },
  {
    num: 16, sym: "S", name: "Azufre", nameEn: "Sulfur", mass: 32.06, period: 3, group: 16, block: "p",
    category: "reactive-nonmetal", config: "[Ne] 3s² 3p⁴", shells: [2, 8, 6],
    en: 2.58, radius: 88, ie: 1000, ea: 200.4, mp: 115.21, bp: 444.6, density: 2.07, phase: "solid",
    ox: [-2, 2, 4, 6], year: "Antigüedad", disc: "Conocido desde la antigüedad",
    origin: "Del latín 'sulphur', fuego y azufre.",
    summary: "Sólido amarillo brillante. Se emplea masivamente en la producción de ácido sulfúrico (el químico industrial más sintetizado del mundo) y en puentes disulfuro de proteínas."
  },
  {
    num: 17, sym: "Cl", name: "Cloro", nameEn: "Chlorine", mass: 35.45, period: 3, group: 17, block: "p",
    category: "halogen", config: "[Ne] 3s² 3p⁵", shells: [2, 8, 7],
    en: 3.16, radius: 79, ie: 1251, ea: 349.0, mp: -101.5, bp: -34.04, density: 0.003214, phase: "gas",
    ox: [-1, 1, 3, 5, 7], year: 1774, disc: "Carl Wilhelm Scheele",
    origin: "Del griego 'chloros' (verde pálido / amarillento).",
    summary: "Gas oxidante potente y desinfectante clave en la potabilización del agua potable. En forma de cloruro sódico (sal común) sustenta la vida celular y la fisiología animal."
  },
  {
    num: 18, sym: "Ar", name: "Argón", nameEn: "Argon", mass: 39.95, period: 3, group: 18, block: "p",
    category: "noble-gas", config: "[Ne] 3s² 3p⁶", shells: [2, 8, 8],
    en: null, radius: 71, ie: 1521, ea: 0, mp: -189.35, bp: -185.85, density: 0.0017837, phase: "gas",
    ox: [0], year: 1894, disc: "Lord Rayleigh y William Ramsay",
    origin: "Del griego 'argos' (inactivo, perezoso), por su notable inercia química.",
    summary: "El tercer gas más común en la atmósfera (0.93%). Se utiliza como atmósfera inerte en soldadura industrial, fabricación de semiconductores e iluminación incandescente."
  },
  {
    num: 19, sym: "K", name: "Potasio", nameEn: "Potassium", mass: 39.098, period: 4, group: 1, block: "s",
    category: "alkali-metal", config: "[Ar] 4s¹", shells: [2, 8, 8, 1],
    en: 0.82, radius: 243, ie: 419, ea: 48.4, mp: 63.5, bp: 759, density: 0.862, phase: "solid",
    ox: [1], year: 1807, disc: "Humphry Davy",
    origin: "Del neerlandés 'potaschen' (cenizas de olla); símbolo K del neo-latín 'kalium'.",
    summary: "Metal alcalino esencial para la función cardiovascular y nerviosa, operando junto al sodio en la bomba sodio-potasio de las membranas celulares."
  },
  {
    num: 20, sym: "Ca", name: "Calcio", nameEn: "Calcium", mass: 40.078, period: 4, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[Ar] 4s²", shells: [2, 8, 8, 2],
    en: 1.00, radius: 194, ie: 590, ea: 2.4, mp: 842, bp: 1484, density: 1.54, phase: "solid",
    ox: [2], year: 1808, disc: "Humphry Davy",
    origin: "Del latín 'calx' (caliza / cal).",
    summary: "El metal más abundante en el cuerpo humano, formando el andamio mineral de huesos y dientes (hidroxiapatita) e interviniendo en la contracción muscular."
  },
  {
    num: 21, sym: "Sc", name: "Escandio", nameEn: "Scandium", mass: 44.956, period: 4, group: 3, block: "d",
    category: "transition-metal", config: "[Ar] 3d¹ 4s²", shells: [2, 8, 9, 2],
    en: 1.36, radius: 184, ie: 633, ea: 18.1, mp: 1541, bp: 2836, density: 2.985, phase: "solid",
    ox: [3], year: 1879, disc: "Lars Fredrik Nilson",
    origin: "Del latín 'Scandia' (Escandinavia).",
    summary: "Metal de transición ligero utilizado en aleaciones de aluminio para marcos de bicicletas de alto rendimiento, bates de béisbol y componentes de cazas militares."
  },
  {
    num: 22, sym: "Ti", name: "Titanio", nameEn: "Titanium", mass: 47.867, period: 4, group: 4, block: "d",
    category: "transition-metal", config: "[Ar] 3d² 4s²", shells: [2, 8, 10, 2],
    en: 1.54, radius: 176, ie: 659, ea: 7.6, mp: 1668, bp: 3287, density: 4.506, phase: "solid",
    ox: [2, 3, 4], year: 1791, disc: "William Gregor",
    origin: "De los Titanes de la mitología griega, símbolos de fuerza colosal.",
    summary: "Conocido por su extraordinaria relación resistencia-peso y biocompatibilidad total. Indispensable en prótesis e implantes médicos, turbinas de avión y naves espaciales."
  },
  {
    num: 23, sym: "V", name: "Vanadio", nameEn: "Vanadium", mass: 50.942, period: 4, group: 5, block: "d",
    category: "transition-metal", config: "[Ar] 3d³ 4s²", shells: [2, 8, 11, 2],
    en: 1.63, radius: 171, ie: 651, ea: 50.6, mp: 1910, bp: 3407, density: 6.11, phase: "solid",
    ox: [2, 3, 4, 5], year: 1801, disc: "Andrés Manuel del Río",
    origin: "De Vanadís, diosa nórdica de la belleza (Freyja), por los bellos colores de sus compuestos.",
    summary: "Aditivo fundamental para aceros de alta tenacidad en herramientas mecánicas, resortes y baterías redox de flujo para almacenamiento a escala de red eléctrica."
  },
  {
    num: 24, sym: "Cr", name: "Cromo", nameEn: "Chromium", mass: 51.996, period: 4, group: 6, block: "d",
    category: "transition-metal", config: "[Ar] 3d⁵ 4s¹", shells: [2, 8, 13, 1],
    en: 1.66, radius: 166, ie: 653, ea: 64.3, mp: 1907, bp: 2671, density: 7.15, phase: "solid",
    ox: [2, 3, 6], year: 1797, disc: "Louis-Nicolas Vauquelin",
    origin: "Del griego 'chroma' (color), debido a la vívida variedad cromática de sus sales.",
    summary: "Otorga propiedades inoxidables al acero común (al menos 10.5% de Cr) e imparte un brillo decorativo duradero en cromados automotrices y herramientas."
  },
  {
    num: 25, sym: "Mn", name: "Manganeso", nameEn: "Manganese", mass: 54.938, period: 4, group: 7, block: "d",
    category: "transition-metal", config: "[Ar] 3d⁵ 4s²", shells: [2, 8, 13, 2],
    en: 1.55, radius: 161, ie: 717, ea: 0, mp: 1246, bp: 2061, density: 7.44, phase: "solid",
    ox: [2, 3, 4, 6, 7], year: 1774, disc: "Johan Gottlieb Gahn",
    origin: "Del latín 'magnes' (imán), por confusión histórica con la magnetita.",
    summary: "Desoxidante y desulfurante indispensable en la metalurgia del acero. Presente en pilas alcalinas estándar (dióxido de manganeso) y fotosíntesis."
  },
  {
    num: 26, sym: "Fe", name: "Hierro", nameEn: "Iron", mass: 55.845, period: 4, group: 8, block: "d",
    category: "transition-metal", config: "[Ar] 3d⁶ 4s²", shells: [2, 8, 14, 2],
    en: 1.83, radius: 156, ie: 762, ea: 15.7, mp: 1538, bp: 2862, density: 7.874, phase: "solid",
    ox: [2, 3], year: "Antigüedad", disc: "Conocido desde tiempos prehistóricos",
    origin: "Del latín 'ferrum'.",
    summary: "El metal más utilizado por la humanidad (más del 90% del metal global procesado). Es el corazón de la hemoglobina para transportar oxígeno en la sangre."
  },
  {
    num: 27, sym: "Co", name: "Cobalto", nameEn: "Cobalt", mass: 58.933, period: 4, group: 9, block: "d",
    category: "transition-metal", config: "[Ar] 3d⁷ 4s²", shells: [2, 8, 15, 2],
    en: 1.88, radius: 152, ie: 760, ea: 63.7, mp: 1495, bp: 2927, density: 8.86, phase: "solid",
    ox: [2, 3], year: 1735, disc: "Georg Brandt",
    origin: "Del alemán 'kobold' (duende malicioso de las minas).",
    summary: "Esencial en cátodos de baterías avanzadas de iones de litio y superaleaciones para motores a reacción. Es el centro metálico de la vitamina B12 (cobalamina)."
  },
  {
    num: 28, sym: "Ni", name: "Níquel", nameEn: "Nickel", mass: 58.693, period: 4, group: 10, block: "d",
    category: "transition-metal", config: "[Ar] 3d⁸ 4s²", shells: [2, 8, 16, 2],
    en: 1.91, radius: 149, ie: 737, ea: 112.0, mp: 1455, bp: 2913, density: 8.912, phase: "solid",
    ox: [2, 3], year: 1751, disc: "Axel Fredrik Cronstedt",
    origin: "Del alemán 'kupfernickel' (cobre del diablo), mineral engañoso que parecía cobre.",
    summary: "Metal dúctil y resistente a la oxidación. Ampliamente utilizado en aceros inoxidables, monedas, acuñaciones y baterías recargables modernas."
  },
  {
    num: 29, sym: "Cu", name: "Cobre", nameEn: "Copper", mass: 63.546, period: 4, group: 11, block: "d",
    category: "transition-metal", config: "[Ar] 3d¹⁰ 4s¹", shells: [2, 8, 18, 1],
    en: 1.90, radius: 145, ie: 745, ea: 118.4, mp: 1084.62, bp: 2562, density: 8.96, phase: "solid",
    ox: [1, 2], year: "Antigüedad", disc: "Conocido desde la antigüedad",
    origin: "Del latín 'cuprum', de la isla de Chipre (famosa por sus minas de cobre).",
    summary: "Extraordinario conductor térmico y eléctrico. La espina dorsal de la red de electrificación mundial, tuberías hidrosanitarias y aleaciones como el bronce y latón."
  },
  {
    num: 30, sym: "Zn", name: "Cinc", nameEn: "Zinc", mass: 65.38, period: 4, group: 12, block: "d",
    category: "transition-metal", config: "[Ar] 3d¹⁰ 4s²", shells: [2, 8, 18, 2],
    en: 1.65, radius: 142, ie: 906, ea: 0, mp: 419.53, bp: 907, density: 7.134, phase: "solid",
    ox: [2], year: 1746, disc: "Andreas Sigismund Marggraf",
    origin: "Del alemán 'zinke' (punta o diente), aludiendo al aspecto de los cristales tras la fundición.",
    summary: "Se utiliza primordialmente en el galvanizado del hierro para protegerlo de la herrumbre. Oligoelemento biológico esencial para cientos de enzimas y el sistema inmune."
  },
  {
    num: 31, sym: "Ga", name: "Galio", nameEn: "Gallium", mass: 69.723, period: 4, group: 13, block: "p",
    category: "post-transition-metal", config: "[Ar] 3d¹⁰ 4s² 4p¹", shells: [2, 8, 18, 3],
    en: 1.81, radius: 136, ie: 579, ea: 28.9, mp: 29.76, bp: 2204, density: 5.907, phase: "solid",
    ox: [3], year: 1875, disc: "Paul-Émile Lecoq de Boisbaudran",
    origin: "Del latín 'Gallia' (Francia).",
    summary: "Metal que se funde en la palma de la mano (29.8 °C). Se emplea en optoelectrónica y semiconductores rápidos como arseniuro de galio (GaAs) y diodos LED azules."
  },
  {
    num: 32, sym: "Ge", name: "Germanio", nameEn: "Germanium", mass: 72.63, period: 4, group: 14, block: "p",
    category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p²", shells: [2, 8, 18, 4],
    en: 2.01, radius: 125, ie: 762, ea: 119.0, mp: 938.25, bp: 2833, density: 5.323, phase: "solid",
    ox: [2, 4], year: 1886, disc: "Clemens Winkler",
    origin: "Del latín 'Germania' (Alemania). Predicho con exactitud por Mendeléyev como eka-silicio.",
    summary: "Semiconductor clave en los primeros transistores de la historia. Utilizado en óptica infrarroja, sistemas de visión nocturna y fibras ópticas de telecomunicaciones."
  },
  {
    num: 33, sym: "As", name: "Arsénico", nameEn: "Arsenic", mass: 74.922, period: 4, group: 15, block: "p",
    category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p³", shells: [2, 8, 18, 5],
    en: 2.18, radius: 114, ie: 947, ea: 78.2, mp: 817, bp: 614, density: 5.776, phase: "solid",
    ox: [-3, 3, 5], year: 1250, disc: "San Alberto Magno",
    origin: "Del griego 'arsenikon', mineral oropimente (sulfuro de arsénico).",
    summary: "Semimetal famoso por su toxicidad histórica. Se aplica industrialmente como dopante semiconductor, conservante de maderas y en optoelectrónica."
  },
  {
    num: 34, sym: "Se", name: "Selenio", nameEn: "Selenium", mass: 78.971, period: 4, group: 16, block: "p",
    category: "reactive-nonmetal", config: "[Ar] 3d¹⁰ 4s² 4p⁴", shells: [2, 8, 18, 6],
    en: 2.55, radius: 103, ie: 941, ea: 195.0, mp: 221, bp: 685, density: 4.809, phase: "solid",
    ox: [-2, 4, 6], year: 1817, disc: "Jöns Jacob Berzelius",
    origin: "Del griego 'Selene', diosa de la Luna.",
    summary: "Posee propiedades fotoconductoras: su conductividad aumenta al recibir luz. Usado en fotocopiadoras, células solares, vidrios tintados y suplementos dietéticos."
  },
  {
    num: 35, sym: "Br", name: "Bromo", nameEn: "Bromine", mass: 79.904, period: 4, group: 17, block: "p",
    category: "halogen", config: "[Ar] 3d¹⁰ 4s² 4p⁵", shells: [2, 8, 18, 7],
    en: 2.96, radius: 94, ie: 1140, ea: 324.6, mp: -7.2, bp: 58.8, density: 3.122, phase: "liquid",
    ox: [-1, 1, 3, 5], year: 1826, disc: "Antoine Jérôme Balard",
    origin: "Del griego 'bromos' (hedor, mal olor).",
    summary: "El único no metal líquido a temperatura ambiente. Líquido pardo-rojizo denso y corrosivo, usado en retardantes de llama, tintes y productos farmacéuticos."
  },
  {
    num: 36, sym: "Kr", name: "Kriptón", nameEn: "Krypton", mass: 83.798, period: 4, group: 18, block: "p",
    category: "noble-gas", config: "[Ar] 3d¹⁰ 4s² 4p⁶", shells: [2, 8, 18, 8],
    en: 3.00, radius: 88, ie: 1351, ea: 0, mp: -157.36, bp: -153.22, density: 0.003733, phase: "gas",
    ox: [0, 2], year: 1898, disc: "William Ramsay y Morris Travers",
    origin: "Del griego 'kryptos' (oculto).",
    summary: "Gas noble utilizado en flashes fotográficos de alta velocidad, láseres de fluoruro de kriptón y ventanas con doble acristalamiento aislante térmico."
  },
  {
    num: 37, sym: "Rb", name: "Rubidio", nameEn: "Rubidium", mass: 85.468, period: 5, group: 1, block: "s",
    category: "alkali-metal", config: "[Kr] 5s¹", shells: [2, 8, 18, 8, 1],
    en: 0.82, radius: 265, ie: 403, ea: 46.9, mp: 39.31, bp: 688, density: 1.532, phase: "solid",
    ox: [1], year: 1861, disc: "Robert Bunsen y Gustav Kirchhoff",
    origin: "Del latín 'rubidus' (rojo oscuro), por las dos líneas rojas de su espectro.",
    summary: "Metal alcalino blando y pirofórico. Utilizado en estándares de frecuencia atómica, relojes atómicos secundarios y física de condensados Bose-Einstein."
  },
  {
    num: 38, sym: "Sr", name: "Estroncio", nameEn: "Strontium", mass: 87.62, period: 5, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[Kr] 5s²", shells: [2, 8, 18, 8, 2],
    en: 0.95, radius: 219, ie: 549, ea: 5.0, mp: 777, bp: 1382, density: 2.64, phase: "solid",
    ox: [2], year: 1790, disc: "Adair Crawford",
    origin: "Del pueblo escocés de Strontian, donde fue identificado en minerales.",
    summary: "Aporta el color rojo carmesí brillante en fuegos artificiales y bengalas de emergencia. Los relojes ópticos atómicos de estroncio son los más precisos del mundo."
  },
  {
    num: 39, sym: "Y", name: "Itrio", nameEn: "Yttrium", mass: 88.906, period: 5, group: 3, block: "d",
    category: "transition-metal", config: "[Kr] 4d¹ 5s²", shells: [2, 8, 18, 9, 2],
    en: 1.22, radius: 212, ie: 600, ea: 29.6, mp: 1526, bp: 3345, density: 4.469, phase: "solid",
    ox: [3], year: 1794, disc: "Johan Gadolin",
    origin: "De la aldea sueca de Ytterby, rica en minerales de tierras raras.",
    summary: "Metalplateado componente clave de superconductores de alta temperatura (YBCO), granates sintéticos para láseres (Nd:YAG) y fósforos de pantallas."
  },
  {
    num: 40, sym: "Zr", name: "Circonio", nameEn: "Zirconium", mass: 91.224, period: 5, group: 4, block: "d",
    category: "transition-metal", config: "[Kr] 4d² 5s²", shells: [2, 8, 18, 10, 2],
    en: 1.33, radius: 206, ie: 640, ea: 41.1, mp: 1855, bp: 4409, density: 6.506, phase: "solid",
    ox: [4], year: 1789, disc: "Martin Heinrich Klaproth",
    origin: "Del persa 'zargun' (de color dorado), nombre del mineral circón.",
    summary: "Extraordinaria resistencia química y baja absorción de neutrones térmicos, ideal para el revestimiento de combustible en reactores nucleares y coronas dentales."
  },
  {
    num: 41, sym: "Nb", name: "Niobio", nameEn: "Niobium", mass: 92.906, period: 5, group: 5, block: "d",
    category: "transition-metal", config: "[Kr] 4d⁴ 5s¹", shells: [2, 8, 18, 12, 1],
    en: 1.60, radius: 198, ie: 652, ea: 86.1, mp: 2477, bp: 4744, density: 8.57, phase: "solid",
    ox: [3, 5], year: 1801, disc: "Charles Hatchett",
    origin: "De Níobe, hija del rey Tántalo en la mitología griega, por su estrecha relación con el tantalio.",
    summary: "Se añade al acero para oleoductos y gasoductos. Esencial en aleaciones superconductoras (Nb-Ti y Nb3Sn) para imanes de resonancias magnéticas y el acelerador LHC."
  },
  {
    num: 42, sym: "Mo", name: "Molibdeno", nameEn: "Molybdenum", mass: 95.95, period: 5, group: 6, block: "d",
    category: "transition-metal", config: "[Kr] 4d⁵ 5s¹", shells: [2, 8, 18, 13, 1],
    en: 2.16, radius: 190, ie: 684, ea: 71.9, mp: 2623, bp: 4639, density: 10.22, phase: "solid",
    ox: [2, 3, 4, 5, 6], year: 1778, disc: "Carl Wilhelm Scheele",
    origin: "Del griego 'molybdos' (plomo), ya que sus minerales se confundían con el grafito y plomo.",
    summary: "Metal refractario de elevadísimo punto de fusión. Se utiliza en aceros de alta resistencia térmica y mecánica y como catalizador en refinerías de petróleo."
  },
  {
    num: 43, sym: "Tc", name: "Tecnecio", nameEn: "Technetium", mass: 98, period: 5, group: 7, block: "d",
    category: "transition-metal", config: "[Kr] 4d⁵ 5s²", shells: [2, 8, 18, 13, 2],
    en: 1.90, radius: 183, ie: 702, ea: 53.0, mp: 2157, bp: 4265, density: 11.5, phase: "solid",
    ox: [4, 7], year: 1937, disc: "Emilio Segrè y Carlo Perrier",
    origin: "Del griego 'technetos' (artificial), por ser el primer elemento producido artificialmente.",
    summary: "El elemento más ligero sin ningún isótopo estable. El isótopo Tc-99m es el radiofármaco más empleado en medicina nuclear para gammagrafías diagnósticas."
  },
  {
    num: 44, sym: "Ru", name: "Rutenio", nameEn: "Ruthenium", mass: 101.07, period: 5, group: 8, block: "d",
    category: "transition-metal", config: "[Kr] 4d⁷ 5s¹", shells: [2, 8, 18, 15, 1],
    en: 2.20, radius: 178, ie: 710, ea: 101.3, mp: 2334, bp: 4150, density: 12.37, phase: "solid",
    ox: [2, 3, 4, 6, 8], year: 1844, disc: "Karl Ernst Claus",
    origin: "Del latín 'Ruthenia' (Rusia).",
    summary: "Metal del grupo del platino. Utilizado como catalizador químico de alta eficiencia, contactos eléctricos resistentes al desgaste y en discos duros magnéticos."
  },
  {
    num: 45, sym: "Rh", name: "Rodio", nameEn: "Rhodium", mass: 102.91, period: 5, group: 9, block: "d",
    category: "transition-metal", config: "[Kr] 4d⁸ 5s¹", shells: [2, 8, 18, 16, 1],
    en: 2.28, radius: 173, ie: 720, ea: 109.7, mp: 1964, bp: 3695, density: 12.41, phase: "solid",
    ox: [3], year: 1804, disc: "William Hyde Wollaston",
    origin: "Del griego 'rhodon' (rosa), por el color rosado de sus disoluciones acuosas.",
    summary: "Uno de los metales preciosos más caros y escasos. Se aplica masivamente en convertidores catalíticos automotrices para neutralizar óxidos de nitrógeno (NOx)."
  },
  {
    num: 46, sym: "Pd", name: "Paladio", nameEn: "Palladium", mass: 106.42, period: 5, group: 10, block: "d",
    category: "transition-metal", config: "[Kr] 4d¹⁰", shells: [2, 8, 18, 18],
    en: 2.20, radius: 169, ie: 804, ea: 53.7, mp: 1554.9, bp: 2963, density: 12.02, phase: "solid",
    ox: [2, 4], year: 1803, disc: "William Hyde Wollaston",
    origin: "Nombrado por el asteroide Palas, descubierto dos años antes.",
    summary: "Capaz de absorber hasta 900 veces su propio volumen en hidrógeno gaseoso. Esencial en catalizadores de escape, joyería ('oro blanco') y condensadores cerámicos multicapa."
  },
  {
    num: 47, sym: "Ag", name: "Plata", nameEn: "Silver", mass: 107.87, period: 5, group: 11, block: "d",
    category: "transition-metal", config: "[Kr] 4d¹⁰ 5s¹", shells: [2, 8, 18, 18, 1],
    en: 1.93, radius: 165, ie: 731, ea: 125.6, mp: 961.78, bp: 2162, density: 10.49, phase: "solid",
    ox: [1], year: "Antigüedad", disc: "Conocida desde tiempos prehistóricos",
    origin: "Del latín 'argentum' (brillante, blanco).",
    summary: "El elemento con la mayor conductividad eléctrica, térmica y reflectividad óptica de todos los metales. Utilizada en joyería, contactos solares y agentes antimicrobianos."
  },
  {
    num: 48, sym: "Cd", name: "Cadmio", nameEn: "Cadmium", mass: 112.41, period: 5, group: 12, block: "d",
    category: "transition-metal", config: "[Kr] 4d¹⁰ 5s²", shells: [2, 8, 18, 18, 2],
    en: 1.69, radius: 161, ie: 868, ea: 0, mp: 321.07, bp: 767, density: 8.69, phase: "solid",
    ox: [2], year: 1817, disc: "Karl Samuel Leberecht Hermann y Friedrich Stromeyer",
    origin: "Del griego 'kadmeia' (calamina), asociado con Cadmo, personaje mitológico.",
    summary: "Metal tóxico utilizado históricamente en baterías recargables de Ni-Cd, pigmentos brillantes amarillos y barras de control neutrónico en reactores."
  },
  {
    num: 49, sym: "In", name: "Indio", nameEn: "Indium", mass: 114.82, period: 5, group: 13, block: "p",
    category: "post-transition-metal", config: "[Kr] 4d¹⁰ 5s² 5p¹", shells: [2, 8, 18, 18, 3],
    en: 1.78, radius: 156, ie: 558, ea: 28.9, mp: 156.6, bp: 2072, density: 7.31, phase: "solid",
    ox: [3], year: 1863, disc: "Ferdinand Reich y Hieronymous Theodor Richter",
    origin: "Del color índigo (azul intenso) observado en su línea espectral.",
    summary: "Componente esencial del óxido de indio y estaño (ITO), película transparente y conductora presente en casi todas las pantallas táctiles y televisores OLED y LCD."
  },
  {
    num: 50, sym: "Sn", name: "Estaño", nameEn: "Tin", mass: 118.71, period: 5, group: 14, block: "p",
    category: "post-transition-metal", config: "[Kr] 4d¹⁰ 5s² 5p²", shells: [2, 8, 18, 18, 4],
    en: 1.96, radius: 145, ie: 709, ea: 107.3, mp: 231.93, bp: 2602, density: 7.287, phase: "solid",
    ox: [2, 4], year: "Antigüedad", disc: "Conocido desde la Edad del Bronce",
    origin: "Del latín 'stannum'.",
    summary: "Metal clave en la historia humana: su aleación con cobre inauguró la Edad del Bronce. Se utiliza hoy en soldadura de circuitos electrónicos y hojalata anticorrosiva."
  },
  {
    num: 51, sym: "Sb", name: "Antimonio", nameEn: "Antimony", mass: 121.76, period: 5, group: 15, block: "p",
    category: "metalloid", config: "[Kr] 4d¹⁰ 5s² 5p³", shells: [2, 8, 18, 18, 5],
    en: 2.05, radius: 133, ie: 834, ea: 103.2, mp: 630.63, bp: 1587, density: 6.685, phase: "solid",
    ox: [-3, 3, 5], year: "Antigüedad", disc: "Conocido desde la antigüedad",
    origin: "Del griego 'anti-monos' (no solo, siempre en mineral); símbolo Sb del latín 'stibium'.",
    summary: "Semimetal utilizado en retardantes de llama, baterías de plomo-ácido, aleaciones tipográficas y detectores de infrarrojos."
  },
  {
    num: 52, sym: "Te", name: "Telurio", nameEn: "Tellurium", mass: 127.60, period: 5, group: 16, block: "p",
    category: "metalloid", config: "[Kr] 4d¹⁰ 5s² 5p⁴", shells: [2, 8, 18, 18, 6],
    en: 2.10, radius: 123, ie: 869, ea: 190.2, mp: 449.51, bp: 988, density: 6.232, phase: "solid",
    ox: [-2, 4, 6], year: 1782, disc: "Franz-Joseph Müller von Reichenstein",
    origin: "Del latín 'tellus' (Tierra), en contraposición a Selene (Luna).",
    summary: "Semimetal semiconductor empleado en paneles solares de película delgada de telururo de cadmio (CdTe), discos regrabables ópticos (CD-RW/DVD) y termoeléctricos."
  },
  {
    num: 53, sym: "I", name: "Yodo", nameEn: "Iodine", mass: 126.90, period: 5, group: 17, block: "p",
    category: "halogen", config: "[Kr] 4d¹⁰ 5s² 5p⁵", shells: [2, 8, 18, 18, 7],
    en: 2.66, radius: 115, ie: 1008, ea: 295.2, mp: 113.7, bp: 184.3, density: 4.93, phase: "solid",
    ox: [-1, 1, 3, 5, 7], year: 1811, disc: "Bernard Courtois",
    origin: "Del griego 'ioeides' (de color violeta), debido al llamativo color de sus vapores al sublimar.",
    summary: "Elemento esencial para la síntesis de hormonas tiroideas (tiroxina) en humanos. Desinfectante antiséptico universal (tintura de yodo) y contraste radiológico."
  },
  {
    num: 54, sym: "Xe", name: "Xenón", nameEn: "Xenon", mass: 131.29, period: 5, group: 18, block: "p",
    category: "noble-gas", config: "[Kr] 4d¹⁰ 5s² 5p⁶", shells: [2, 8, 18, 18, 8],
    en: 2.60, radius: 108, ie: 1170, ea: 0, mp: -111.7, bp: -108.12, density: 0.005887, phase: "gas",
    ox: [0, 2, 4, 6, 8], year: 1898, disc: "William Ramsay y Morris Travers",
    origin: "Del griego 'xenos' (extraño, forastero).",
    summary: "Gas noble pesado. Se emplea como propulsor de iones en sondas de exploración espacial, en faros de descarga de alta intensidad y en anestesia médica general."
  },
  {
    num: 55, sym: "Cs", name: "Cesio", nameEn: "Caesium", mass: 132.91, period: 6, group: 1, block: "s",
    category: "alkali-metal", config: "[Xe] 6s¹", shells: [2, 8, 18, 18, 8, 1],
    en: 0.79, radius: 298, ie: 376, ea: 45.9, mp: 28.44, bp: 671, density: 1.93, phase: "solid",
    ox: [1], year: 1860, disc: "Robert Bunsen y Gustav Kirchhoff",
    origin: "Del latín 'caesius' (azul celeste), por sus líneas espectrales.",
    summary: "El segundo elemento más electropositivo. La frecuencia de transición hiperfina del isótopo Cs-133 define la unidad fundamental del segundo en el Sistema Internacional."
  },
  {
    num: 56, sym: "Ba", name: "Bario", nameEn: "Barium", mass: 137.33, period: 6, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[Xe] 6s²", shells: [2, 8, 18, 18, 8, 2],
    en: 0.89, radius: 253, ie: 503, ea: 14.0, mp: 727, bp: 1897, density: 3.51, phase: "solid",
    ox: [2], year: 1774, disc: "Carl Wilhelm Scheele",
    origin: "Del griego 'barys' (pesado).",
    summary: "Metal alcalinotérreo reactivo. El sulfato de bario (BaSO₄) se utiliza como medio de contraste radiológico insoluble para estudios digestivos y en lodos de perforación petrolera."
  },
  {
    num: 57, sym: "La", name: "Lantano", nameEn: "Lanthanum", mass: 138.91, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 5d¹ 6s²", shells: [2, 8, 18, 18, 9, 2],
    en: 1.10, radius: 195, ie: 538, ea: 48.0, mp: 920, bp: 3464, density: 6.162, phase: "solid",
    ox: [3], year: 1839, disc: "Carl Gustaf Mosander",
    origin: "Del griego 'lanthanein' (permanecer oculto).",
    summary: "Primer elemento de los lantánidos. Utilizado en electrodos de iluminación de arco de carbono, vidrios ópticos de alta refracción para lentes fotográficas y catalizadores."
  },
  {
    num: 58, sym: "Ce", name: "Cerio", nameEn: "Cerium", mass: 140.12, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹ 5d¹ 6s²", shells: [2, 8, 18, 19, 9, 2],
    en: 1.12, radius: 185, ie: 534, ea: 50.0, mp: 798, bp: 3443, density: 6.77, phase: "solid",
    ox: [3, 4], year: 1803, disc: "Martin Heinrich Klaproth, Jöns Jacob Berzelius y Wilhelm Hisinger",
    origin: "Nombrado por el planeta enano Ceres, recién descubierto en 1801.",
    summary: "El lantánido más abundante. El óxido de cerio es un excelente agente de pulido para vidrio de precisión y catalizador en convertidores catalíticos de automóviles."
  },
  {
    num: 59, sym: "Pr", name: "Praseodimio", nameEn: "Praseodymium", mass: 140.91, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f³ 6s²", shells: [2, 8, 18, 21, 8, 2],
    en: 1.13, radius: 247, ie: 527, ea: 50.0, mp: 931, bp: 3520, density: 6.77, phase: "solid",
    ox: [3], year: 1885, disc: "Carl Auer von Welsbach",
    origin: "Del griego 'prasios didymos' (gemelo verde), por el color verde de sus sales.",
    summary: "Utilizado junto al neodimio en imanes permanentes de máxima potencia para generadores eólicos y en gafas protectoras para soldadores de vidrio."
  },
  {
    num: 60, sym: "Nd", name: "Neodimio", nameEn: "Neodymium", mass: 144.24, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁴ 6s²", shells: [2, 8, 18, 22, 8, 2],
    en: 1.14, radius: 206, ie: 533, ea: 50.0, mp: 1021, bp: 3074, density: 7.01, phase: "solid",
    ox: [3], year: 1885, disc: "Carl Auer von Welsbach",
    origin: "Del griego 'neos didymos' (nuevo gemelo).",
    summary: "Famoso por los potentes imanes de neodimio (NdFeB), esenciales en motores de vehículos eléctricos, auriculares, discos duros y generadores de turbinas eólicas."
  },
  {
    num: 61, sym: "Pm", name: "Prometio", nameEn: "Promethium", mass: 145, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁵ 6s²", shells: [2, 8, 18, 23, 8, 2],
    en: 1.13, radius: 205, ie: 540, ea: 50.0, mp: 1042, bp: 3000, density: 7.26, phase: "solid",
    ox: [3], year: 1945, disc: "Chien Shiung Wu, Jacob A. Marinsky, Lawrence E. Glendenin y Charles D. Coryell",
    origin: "De Prometeo, el titán mitológico que robó el fuego a los dioses para entregarlo a la humanidad.",
    summary: "Lantánido radiactivo sin isótopos estables. Utilizado en microbaterías nucleares de larga duración para sondas espaciales y marcapasos históricos."
  },
  {
    num: 62, sym: "Sm", name: "Samario", nameEn: "Samarium", mass: 150.36, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁶ 6s²", shells: [2, 8, 18, 24, 8, 2],
    en: 1.17, radius: 238, ie: 545, ea: 50.0, mp: 1072, bp: 1794, density: 7.52, phase: "solid",
    ox: [2, 3], year: 1879, disc: "Paul-Émile Lecoq de Boisbaudran",
    origin: "Nombrado a partir del mineral samarskita, dedicado al coronel e ingeniero de minas ruso Vasili Samarsky-Bykhovets.",
    summary: "Utilizado en imanes de samario-cobalto resistentes a temperaturas extremas sin perder magnetismo, y en barras de control de reactores nucleares."
  },
  {
    num: 63, sym: "Eu", name: "Europio", nameEn: "Europium", mass: 151.96, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁷ 6s²", shells: [2, 8, 18, 25, 8, 2],
    en: 1.20, radius: 231, ie: 547, ea: 50.0, mp: 822, bp: 1529, density: 5.244, phase: "solid",
    ox: [2, 3], year: 1901, disc: "Eugène-Anatole Demarçay",
    origin: "Nombrado en honor al continente de Europa.",
    summary: "El lantánido más reactivo químicamente. Sus compuestos fosforescentes rojos son cruciales como elementos antifalsificación fluorescentes en billetes de euro."
  },
  {
    num: 64, sym: "Gd", name: "Gadolinio", nameEn: "Gadolinium", mass: 157.25, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁷ 5d¹ 6s²", shells: [2, 8, 18, 25, 9, 2],
    en: 1.20, radius: 233, ie: 593, ea: 50.0, mp: 1313, bp: 3273, density: 7.90, phase: "solid",
    ox: [3], year: 1880, disc: "Jean Charles Galissard de Marignac",
    origin: "En honor al químico finlandés Johan Gadolin, pionero en el estudio de las tierras raras.",
    summary: "Posee propiedades ferromagnéticas por debajo de 20 °C. Sus complejos quelados son el agente de contraste por excelencia en resonancia magnética nuclear (MRI)."
  },
  {
    num: 65, sym: "Tb", name: "Terbio", nameEn: "Terbium", mass: 158.93, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f⁹ 6s²", shells: [2, 8, 18, 27, 8, 2],
    en: 1.20, radius: 225, ie: 566, ea: 50.0, mp: 1356, bp: 3230, density: 8.23, phase: "solid",
    ox: [3, 4], year: 1843, disc: "Carl Gustaf Mosander",
    origin: "De la aldea sueca de Ytterby.",
    summary: "Emisor de fluorescencia verde brillante. Utilizado en lámparas fluorescentes de alta eficiencia, actuadores magnetoestrictivos (Terfenol-D) y sonar naval."
  },
  {
    num: 66, sym: "Dy", name: "Disprosio", nameEn: "Dysprosium", mass: 162.50, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹⁰ 6s²", shells: [2, 8, 18, 28, 8, 2],
    en: 1.22, radius: 228, ie: 573, ea: 50.0, mp: 1412, bp: 2567, density: 8.55, phase: "solid",
    ox: [3], year: 1886, disc: "Paul-Émile Lecoq de Boisbaudran",
    origin: "Del griego 'dysprositos' (difícil de conseguir).",
    summary: "Aumenta la resistencia térmica y la coercitividad de los imanes de neodimio en motores eléctricos de automoción para evitar su desmagnetización."
  },
  {
    num: 67, sym: "Ho", name: "Holmio", nameEn: "Holmium", mass: 164.93, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹¹ 6s²", shells: [2, 8, 18, 29, 8, 2],
    en: 1.23, radius: 226, ie: 581, ea: 50.0, mp: 1474, bp: 2700, density: 8.79, phase: "solid",
    ox: [3], year: 1878, disc: "Marc Delafontaine y Jacques-Louis Soret",
    origin: "Del latín 'Holmia', nombre histórico de Estocolmo.",
    summary: "Posee el momento magnético más elevado de cualquier elemento natural. Usado en polos de imanes superconductores y en láseres quirúrgicos médicos (Ho:YAG)."
  },
  {
    num: 68, sym: "Er", name: "Erbio", nameEn: "Erbium", mass: 167.26, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹² 6s²", shells: [2, 8, 18, 30, 8, 2],
    en: 1.24, radius: 226, ie: 589, ea: 50.0, mp: 1529, bp: 2868, density: 9.066, phase: "solid",
    ox: [3], year: 1843, disc: "Carl Gustaf Mosander",
    origin: "De la aldea sueca de Ytterby.",
    summary: "Clave en amplificadores ópticos de fibra dopada con erbio (EDFA), los cuales reamplifican señales de telecomunicaciones submarinas en internet intercontinental."
  },
  {
    num: 69, sym: "Tm", name: "Tulio", nameEn: "Thulium", mass: 168.93, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹³ 6s²", shells: [2, 8, 18, 31, 8, 2],
    en: 1.25, radius: 222, ie: 597, ea: 50.0, mp: 1545, bp: 1950, density: 9.32, phase: "solid",
    ox: [3], year: 1879, disc: "Per Teodor Cleve",
    origin: "De 'Thule', mítico nombre grecorromano para las regiones más septentrionales del mundo (Escandinavia).",
    summary: "El lantánido natural más escaso. Se utiliza en equipos portátiles de rayos X para zonas remotas y en láseres quirúrgicos de alta precisión."
  },
  {
    num: 70, sym: "Yb", name: "Iterbio", nameEn: "Ytterbium", mass: 173.05, period: 6, group: 3, block: "f",
    category: "lanthanide", config: "[Xe] 4f¹⁴ 6s²", shells: [2, 8, 18, 32, 8, 2],
    en: 1.10, radius: 222, ie: 603, ea: 50.0, mp: 824, bp: 1196, density: 6.90, phase: "solid",
    ox: [2, 3], year: 1878, disc: "Jean Charles Galissard de Marignac",
    origin: "De la aldea sueca de Ytterby.",
    summary: "Utilizado como dopante en amplificadores de fibra óptica, láseres industriales de corte de chapa metálica y como estándar de referencia en relojes atómicos ópticos."
  },
  {
    num: 71, sym: "Lu", name: "Lutecio", nameEn: "Lutetium", mass: 174.97, period: 6, group: 3, block: "d",
    category: "lanthanide", config: "[Xe] 4f¹⁴ 5d¹ 6s²", shells: [2, 8, 18, 32, 9, 2],
    en: 1.27, radius: 217, ie: 524, ea: 50.0, mp: 1663, bp: 3402, density: 9.841, phase: "solid",
    ox: [3], year: 1907, disc: "Georges Urbain y Carl Auer von Welsbach",
    origin: "Del latín 'Lutetia', nombre romano de París.",
    summary: "El último y más denso de los lantánidos. El isótopo radiactivo Lu-177 se emplea con gran éxito en medicina nuclear en terapias dirigidas contra tumores neuroendocrinos."
  },
  {
    num: 72, sym: "Hf", name: "Hafnio", nameEn: "Hafnium", mass: 178.49, period: 6, group: 4, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d² 6s²", shells: [2, 8, 18, 32, 10, 2],
    en: 1.30, radius: 208, ie: 659, ea: 0, mp: 2233, bp: 4603, density: 13.31, phase: "solid",
    ox: [4], year: 1923, disc: "Dirk Coster y George de Hevesy",
    origin: "Del latín 'Hafnia', nombre antiguo de Copenhague.",
    summary: "Gran absorbente de neutrones térmicos (usado en submarinos nucleares) y dieléctrico de alto-k (HfO₂) en procesadores informáticos microscópicos modernos."
  },
  {
    num: 73, sym: "Ta", name: "Tántalo", nameEn: "Tantalum", mass: 180.95, period: 6, group: 5, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d³ 6s²", shells: [2, 8, 18, 32, 11, 2],
    en: 1.50, radius: 200, ie: 761, ea: 31.0, mp: 3017, bp: 5458, density: 16.69, phase: "solid",
    ox: [5], year: 1802, disc: "Anders Gustaf Ekeberg",
    origin: "Del rey Tántalo de la mitología griega, por la 'tortura' de aislarlo en ácidos.",
    summary: "Metal inerte resistente a la corrosión ácida. Vital en condensadores electrolíticos de tantalio en smartphones, ordenadores y satélites espaciales."
  },
  {
    num: 74, sym: "W", name: "Wolframio", nameEn: "Tungsten", mass: 183.84, period: 6, group: 6, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d⁴ 6s²", shells: [2, 8, 18, 32, 12, 2],
    en: 2.36, radius: 193, ie: 770, ea: 78.6, mp: 3422, bp: 5555, density: 19.25, phase: "solid",
    ox: [2, 4, 6], year: 1783, disc: "Fausto y Juan José Elhúyar",
    origin: "Del alemán 'wolf rahm' (baba de lobo); también 'tung sten' (piedra pesada en sueco).",
    summary: "El elemento con el punto de fusión más alto de todos los metales (3422 °C). Utilizado en filamentos de bombillas, electrodos TIG de soldadura y carburo de tungsteno."
  },
  {
    num: 75, sym: "Re", name: "Renio", nameEn: "Rhenium", mass: 186.21, period: 6, group: 7, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d⁵ 6s²", shells: [2, 8, 18, 32, 13, 2],
    en: 1.90, radius: 188, ie: 760, ea: 14.5, mp: 3186, bp: 5596, density: 21.02, phase: "solid",
    ox: [2, 4, 6, 7], year: 1925, disc: "Masataka Ogawa, Walter Noddack, Ida Tacke y Otto Berg",
    origin: "Del latín 'Rhenus', río Rin en Europa.",
    summary: "Uno de los elementos estables descubiertos más tardíamente. Se agrega al níquel en superaleaciones monocristalinas para paletas de turbinas de motores de aviones a reacción."
  },
  {
    num: 76, sym: "Os", name: "Osmio", nameEn: "Osmium", mass: 190.23, period: 6, group: 8, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d⁶ 6s²", shells: [2, 8, 18, 32, 14, 2],
    en: 2.20, radius: 185, ie: 840, ea: 106.1, mp: 3033, bp: 5012, density: 22.59, phase: "solid",
    ox: [2, 3, 4, 6, 8], year: 1803, disc: "Smithson Tennant",
    origin: "Del griego 'osme' (olor), por el olor picante y tóxico de su tetróxido (OsO₄).",
    summary: "El elemento natural más denso de toda la tabla periódica (22.59 g/cm³). Utilizado en puntas de estilográficas duraderas, pivotes de precisión y tinción de lípidos en microscopía."
  },
  {
    num: 77, sym: "Ir", name: "Iridio", nameEn: "Iridium", mass: 192.22, period: 6, group: 9, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d⁷ 6s²", shells: [2, 8, 18, 32, 15, 2],
    en: 2.20, radius: 180, ie: 880, ea: 151.0, mp: 2446, bp: 4428, density: 22.56, phase: "solid",
    ox: [3, 4], year: 1803, disc: "Smithson Tennant",
    origin: "De Iris, diosa del arco iris, por los colores vivos de sus sales.",
    summary: "El metal con mayor resistencia a la corrosión. Su anómala abundancia en el límite geológico K-Pg evidenció el impacto del asteroide que extinguió a los dinosaurios."
  },
  {
    num: 78, sym: "Pt", name: "Platino", nameEn: "Platinum", mass: 195.08, period: 6, group: 10, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", shells: [2, 8, 18, 32, 17, 1],
    en: 2.28, radius: 177, ie: 870, ea: 205.3, mp: 1768.3, bp: 3825, density: 21.45, phase: "solid",
    ox: [2, 4], year: 1735, disc: "Antonio de Ulloa",
    origin: "Del español 'platina' (pequeña plata), diminutivo despectivo colonial.",
    summary: "Metal precioso noble noble y extraordinario catalizador. El fármaco cisplatino es uno de los agentes quimioterapéuticos más eficaces contra el cáncer."
  },
  {
    num: 79, sym: "Au", name: "Oro", nameEn: "Gold", mass: 196.97, period: 6, group: 11, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", shells: [2, 8, 18, 32, 18, 1],
    en: 2.54, radius: 174, ie: 890, ea: 222.8, mp: 1064.18, bp: 2970, density: 19.30, phase: "solid",
    ox: [1, 3], year: "Antigüedad", disc: "Conocido desde la antigüedad",
    origin: "Del latín 'aurum' (aurora resplandeciente).",
    summary: "El metal más maleable y dúctil que existe. Inalterable a la oxidación atmosférica; empleado históricamente como reserva monetaria y en contactos electrónicos de microchips."
  },
  {
    num: 80, sym: "Hg", name: "Mercurio", nameEn: "Mercury", mass: 200.59, period: 6, group: 12, block: "d",
    category: "transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", shells: [2, 8, 18, 32, 18, 2],
    en: 2.00, radius: 171, ie: 1007, ea: 0, mp: -38.83, bp: 356.73, density: 13.534, phase: "liquid",
    ox: [1, 2], year: "Antigüedad", disc: "Conocido desde tiempos prehistóricos",
    origin: "Del dios romano Mercurio; símbolo Hg del griego 'hydrargyrum' (plata líquida).",
    summary: "El único metal elemental en estado líquido a temperatura ambiente. Empleado históricamente en termómetros, barómetros y amalgamas dentales."
  },
  {
    num: 81, sym: "Tl", name: "Talio", nameEn: "Thallium", mass: 204.38, period: 6, group: 13, block: "p",
    category: "post-transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", shells: [2, 8, 18, 32, 18, 3],
    en: 1.62, radius: 156, ie: 589, ea: 19.2, mp: 304, bp: 1473, density: 11.85, phase: "solid",
    ox: [1, 3], year: 1861, disc: "William Crookes",
    origin: "Del griego 'thallos' (brote verde joven), por su línea espectral verde brillante.",
    summary: "Metal blando sumamente tóxico ('el veneno del envenenador'). Utilizado en detectores de radiación gamma (cristales de NaI dopados con Tl) y en cardiología nuclear."
  },
  {
    num: 82, sym: "Pb", name: "Plomo", nameEn: "Lead", mass: 207.2, period: 6, group: 14, block: "p",
    category: "post-transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", shells: [2, 8, 18, 32, 18, 4],
    en: 2.33, radius: 154, ie: 716, ea: 35.1, mp: 327.46, bp: 1749, density: 11.34, phase: "solid",
    ox: [2, 4], year: "Antigüedad", disc: "Conocido desde la antigüedad",
    origin: "Del latín 'plumbum'.",
    summary: "Metal denso, maleable y resistente a la radiación ionizante (escudos de plomo). Es el producto final estable de las series de desintegración del uranio y torio."
  },
  {
    num: 83, sym: "Bi", name: "Bismuto", nameEn: "Bismuth", mass: 208.98, period: 6, group: 15, block: "p",
    category: "post-transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", shells: [2, 8, 18, 32, 18, 5],
    en: 2.02, radius: 143, ie: 703, ea: 91.2, mp: 271.4, bp: 1564, density: 9.78, phase: "solid",
    ox: [3, 5], year: 1753, disc: "Claude François Geoffroy",
    origin: "Del alemán 'wissmuth' (materia blanca).",
    summary: "Metal pesado prácticamente no tóxico, famoso por sus espectaculares cristales irisados en tolva. Se usa en subsalicilato de bismuto (fármaco digestivo) y fusibles."
  },
  {
    num: 84, sym: "Po", name: "Polonio", nameEn: "Polonium", mass: 209, period: 6, group: 16, block: "p",
    category: "post-transition-metal", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", shells: [2, 8, 18, 32, 18, 6],
    en: 2.00, radius: 135, ie: 812, ea: 183.3, mp: 254, bp: 962, density: 9.196, phase: "solid",
    ox: [-2, 2, 4], year: 1898, disc: "Marie y Pierre Curie",
    origin: "Nombrado en honor a Polonia, patria natal de Marie Curie.",
    summary: "Elemento radiactivo emisor de partículas alfa de alta energía. Utilizado en cepillos antiestáticos de laboratorios fotográficos y fuentes termoeléctricas espaciales."
  },
  {
    num: 85, sym: "At", name: "Astato", nameEn: "Astatine", mass: 210, period: 6, group: 17, block: "p",
    category: "halogen", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", shells: [2, 8, 18, 32, 18, 7],
    en: 2.20, radius: 127, ie: 890, ea: 270.1, mp: 302, bp: 337, density: 6.35, phase: "solid",
    ox: [-1, 1, 3, 5], year: 1940, disc: "Dale R. Corson, Kenneth Ross MacKenzie y Emilio Segrè",
    origin: "Del griego 'astatos' (inestable).",
    summary: "El elemento natural más raro de la corteza terrestre (menos de 30 gramos en todo el planeta en un momento dado). El isótopo At-211 es investigado para radioterapia dirigida."
  },
  {
    num: 86, sym: "Rn", name: "Radón", nameEn: "Radon", mass: 222, period: 6, group: 18, block: "p",
    category: "noble-gas", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", shells: [2, 8, 18, 32, 18, 8],
    en: null, radius: 120, ie: 1037, ea: 0, mp: -71, bp: -61.7, density: 0.00973, phase: "gas",
    ox: [0, 2], year: 1900, disc: "Friedrich Ernst Dorn",
    origin: "De la radiación emitida por el radio mineral.",
    summary: "Gas noble radiactivo e incoloro producido por la desintegración natural del radio en suelos y granitos; representa la principal fuente natural de radiación humana de fondo."
  },
  {
    num: 87, sym: "Fr", name: "Francio", nameEn: "Francium", mass: 223, period: 7, group: 1, block: "s",
    category: "alkali-metal", config: "[Rn] 7s¹", shells: [2, 8, 18, 32, 18, 8, 1],
    en: 0.70, radius: 348, ie: 380, ea: 47.0, mp: 27, bp: 677, density: 1.87, phase: "solid",
    ox: [1], year: 1939, disc: "Marguerite Perey",
    origin: "Nombrado en honor a Francia, patria natal de su descubridora Marguerite Perey.",
    summary: "El metal alcalino más inestable; su isótopo más longevo tiene una vida media de solo 22 minutos. Se estudian sus átomos en trampas magneto-ópticas de precisión."
  },
  {
    num: 88, sym: "Ra", name: "Radio", nameEn: "Radium", mass: 226, period: 7, group: 2, block: "s",
    category: "alkaline-earth-metal", config: "[Rn] 7s²", shells: [2, 8, 18, 32, 18, 8, 2],
    en: 0.90, radius: 283, ie: 509, ea: 9.6, mp: 700, bp: 1737, density: 5.5, phase: "solid",
    ox: [2], year: 1898, disc: "Marie y Pierre Curie",
    origin: "Del latín 'radius' (rayo), por su intensa radiactividad natural.",
    summary: "Famoso por las pinturas luminiscentes de principios del siglo XX. Hoy el Ra-223 se utiliza en terapias oncológicas contra metástasis óseas."
  },
  {
    num: 89, sym: "Ac", name: "Actinio", nameEn: "Actinium", mass: 227, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 6d¹ 7s²", shells: [2, 8, 18, 32, 18, 9, 2],
    en: 1.10, radius: 195, ie: 499, ea: 33.8, mp: 1050, bp: 3198, density: 10.07, phase: "solid",
    ox: [3], year: 1899, disc: "André-Louis Debierne",
    origin: "Del griego 'aktis' (rayo de luz).",
    summary: "Primer elemento de la serie de los actínidos. Emite un brillo azul tenue en la oscuridad debido a la ionización del aire por su intensa actividad radiactiva."
  },
  {
    num: 90, sym: "Th", name: "Torio", nameEn: "Thorium", mass: 232.04, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 6d² 7s²", shells: [2, 8, 18, 32, 18, 10, 2],
    en: 1.30, radius: 180, ie: 587, ea: 112.7, mp: 1750, bp: 4788, density: 11.72, phase: "solid",
    ox: [4], year: 1828, disc: "Jöns Jacob Berzelius",
    origin: "En honor a Thor, dios nórdico del trueno.",
    summary: "Elemento radiactivo natural con vida media de 14 mil millones de años. Es una alternativa prometedora al uranio como combustible fértil en reactores de sales fundidas."
  },
  {
    num: 91, sym: "Pa", name: "Protactinio", nameEn: "Protactinium", mass: 231.04, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f² 6d¹ 7s²", shells: [2, 8, 18, 32, 20, 9, 2],
    en: 1.50, radius: 180, ie: 568, ea: 53.0, mp: 1568, bp: 4027, density: 15.37, phase: "solid",
    ox: [4, 5], year: 1913, disc: "Kasimir Fajans, Oswald Helmuth Göhring, Otto Hahn y Lise Meitner",
    origin: "Del griego 'protos' (primero) y actinio: el precursor que decae a actinio.",
    summary: "Elemento raro intermedio en el decaimiento del uranio. Se utiliza en geocronología isotópica marina y estudios nucleares fundamentales."
  },
  {
    num: 92, sym: "U", name: "Uranio", nameEn: "Uranium", mass: 238.03, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f³ 6d¹ 7s²", shells: [2, 8, 18, 32, 21, 9, 2],
    en: 1.38, radius: 175, ie: 598, ea: 50.9, mp: 1132.2, bp: 4131, density: 18.95, phase: "solid",
    ox: [3, 4, 5, 6], year: 1789, disc: "Martin Heinrich Klaproth",
    origin: "En honor al planeta Urano, descubierto ocho años antes.",
    summary: "Combustible básico de los reactores nucleares civiles de fisión y armas nucleares históricas. Su isótopo U-235 sustenta la reacción en cadena autosostenida."
  },
  {
    num: 93, sym: "Np", name: "Neptunio", nameEn: "Neptunium", mass: 237, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f⁴ 6d¹ 7s²", shells: [2, 8, 18, 32, 22, 9, 2],
    en: 1.36, radius: 175, ie: 604, ea: 45.9, mp: 644, bp: 3902, density: 20.45, phase: "solid",
    ox: [3, 4, 5, 6, 7], year: 1940, disc: "Edwin McMillan y Philip H. Abelson",
    origin: "Nombrado por el planeta Neptuno, el siguiente después de Urano.",
    summary: "El primer elemento transuránico sintético producido en la historia. Se genera como subproducto en reactores nucleares y es precursor del plutonio-238."
  },
  {
    num: 94, sym: "Pu", name: "Plutonio", nameEn: "Plutonium", mass: 244, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f⁶ 7s²", shells: [2, 8, 18, 32, 24, 8, 2],
    en: 1.28, radius: 175, ie: 585, ea: -48.3, mp: 640, bp: 3228, density: 19.84, phase: "solid",
    ox: [3, 4, 5, 6, 7], year: 1940, disc: "Glenn T. Seaborg, Edwin McMillan, Joseph W. Kennedy y Arthur Wahl",
    origin: "Nombrado por el planeta enano Plutón.",
    summary: "Material fisible clave en armas y reactores nucleares. El Pu-238 alimenta generadores termoeléctricos de radioisótopos (RTG) en sondas como Voyager, Curiosity y Perseverance."
  },
  {
    num: 95, sym: "Am", name: "Americio", nameEn: "Americium", mass: 243, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f⁷ 7s²", shells: [2, 8, 18, 32, 25, 8, 2],
    en: 1.30, radius: 175, ie: 578, ea: 9.9, mp: 1176, bp: 2011, density: 13.67, phase: "solid",
    ox: [3, 4, 5, 6], year: 1944, disc: "Glenn T. Seaborg, Ralph A. James, Leon O. Morgan y Albert Ghiorso",
    origin: "En honor al continente americano, análogo al europio en los lantánidos.",
    summary: "El isótopo Am-241 es el emisor de partículas alfa presente en millones de detectores de humo domésticos de ionización para salvar vidas en incendios."
  },
  {
    num: 96, sym: "Cm", name: "Curio", nameEn: "Curium", mass: 247, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f⁷ 6d¹ 7s²", shells: [2, 8, 18, 32, 25, 9, 2],
    en: 1.30, radius: 175, ie: 581, ea: 27.2, mp: 1345, bp: 3110, density: 13.51, phase: "solid",
    ox: [3, 4], year: 1944, disc: "Glenn T. Seaborg, Ralph A. James y Albert Ghiorso",
    origin: "En honor a Marie y Pierre Curie, científicos pioneros de la radiactividad.",
    summary: "Metal plateado emisor alfa intenso. Se utiliza como fuente de partículas alfa en espectrómetros APXS para analizar la composición de rocas en Marte."
  },
  {
    num: 97, sym: "Bk", name: "Berkelio", nameEn: "Berkelium", mass: 247, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f⁹ 7s²", shells: [2, 8, 18, 32, 27, 8, 2],
    en: 1.30, radius: 170, ie: 601, ea: -165.2, mp: 986, bp: 2627, density: 14.78, phase: "solid",
    ox: [3, 4], year: 1949, disc: "Stanley G. Thompson, Albert Ghiorso y Glenn T. Seaborg",
    origin: "Nombrado en honor a la ciudad y universidad de Berkeley (California).",
    summary: "Se produce en microgramos como blanco de bombardeo en reactores de alto flujo, siendo la pieza fundamental para sintetizar elementos como el Teneso (117)."
  },
  {
    num: 98, sym: "Cf", name: "Californio", nameEn: "Californium", mass: 251, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f¹⁰ 7s²", shells: [2, 8, 18, 32, 28, 8, 2],
    en: 1.30, radius: 186, ie: 608, ea: -97.3, mp: 900, bp: 1470, density: 15.1, phase: "solid",
    ox: [3], year: 1950, disc: "Stanley G. Thompson, Kenneth Street Jr., Albert Ghiorso y Glenn T. Seaborg",
    origin: "En honor al estado y la Universidad de California.",
    summary: "El Cf-252 es una fuente portátil potentísima de neutrones por fisión espontánea, utilizada para iniciar reactores nucleares y detectar explosivos y humedad en suelos."
  },
  {
    num: 99, sym: "Es", name: "Einstenio", nameEn: "Einsteinium", mass: 252, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f¹¹ 7s²", shells: [2, 8, 18, 32, 29, 8, 2],
    en: 1.30, radius: 186, ie: 619, ea: -28.6, mp: 860, bp: 996, density: 8.84, phase: "solid",
    ox: [3], year: 1952, disc: "Albert Ghiorso et al.",
    origin: "En honor a Albert Einstein.",
    summary: "Descubierto en los escombros radiactivos de la primera prueba termonuclear de bomba de hidrógeno ('Ivy Mike'). No tiene aplicaciones fuera de la física teórica."
  },
  {
    num: 100, sym: "Fm", name: "Fermio", nameEn: "Fermium", mass: 257, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f¹² 7s²", shells: [2, 8, 18, 32, 30, 8, 2],
    en: 1.30, radius: 198, ie: 627, ea: 33.9, mp: 1527, bp: null, density: 9.7, phase: "solid",
    ox: [3], year: 1952, disc: "Albert Ghiorso et al.",
    origin: "En honor al físico italiano Enrico Fermi, creador del primer reactor nuclear artificial.",
    summary: "El elemento más pesado que puede sintetizarse mediante captura neutrónica sucesiva en reactores nucleares. Todos los elementos posteriores requieren colisionadores de iones pesados."
  },
  {
    num: 101, sym: "Md", name: "Mendelevio", nameEn: "Mendelevium", mass: 258, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f¹³ 7s²", shells: [2, 8, 18, 32, 31, 8, 2],
    en: 1.30, radius: 173, ie: 635, ea: 93.9, mp: 827, bp: null, density: 10.3, phase: "solid",
    ox: [2, 3], year: 1955, disc: "Albert Ghiorso, Bernard G. Harvey, Gregory R. Choppin, Stanley G. Thompson y Glenn T. Seaborg",
    origin: "En honor al químico ruso Dmitri Mendeléyev, creador del sistema periódico.",
    summary: "Primer elemento sintetizado bombardeando átomos uno a uno con el ciclotrón de Berkeley. Usado exclusivamente en investigaciones nucleares."
  },
  {
    num: 102, sym: "No", name: "Nobelio", nameEn: "Nobelium", mass: 259, period: 7, group: 3, block: "f",
    category: "actinide", config: "[Rn] 5f¹⁴ 7s²", shells: [2, 8, 18, 32, 32, 8, 2],
    en: 1.30, radius: 169, ie: 642, ea: -223.2, mp: 827, bp: null, density: 9.9, phase: "solid",
    ox: [2, 3], year: 1966, disc: "JINR (Dubná, Rusia)",
    origin: "En honor al químico e inventor sueco Alfred Nobel, creador de los Premios Nobel.",
    summary: "Se comporta preferentemente en estado de oxidación +2 en solución acuosa debido a la extraordinaria estabilidad de su subcapa f completa (5f¹⁴)."
  },
  {
    num: 103, sym: "Lr", name: "Laurencio", nameEn: "Lawrencium", mass: 266, period: 7, group: 3, block: "d",
    category: "actinide", config: "[Rn] 5f¹⁴ 7s² 7p¹", shells: [2, 8, 18, 32, 32, 8, 3],
    en: 1.30, radius: 161, ie: 470, ea: -30.0, mp: 1627, bp: null, density: 15.6, phase: "solid",
    ox: [3], year: 1961, disc: "Albert Ghiorso, Torbjørn Sikkeland, Almon Larsh y Robert M. Latimer",
    origin: "En honor a Ernest Lawrence, inventor del ciclotrón y fundador del Laboratorio Berkeley.",
    summary: "Último elemento de los actínidos. Posee una configuración inusual con un electrón en la capa 7p debido a efectos relativistas sobre su nube electrónica."
  },
  // Superheavy elements 104 - 118:
  {
    num: 104, sym: "Rf", name: "Rutherfordio", nameEn: "Rutherfordium", mass: 267, period: 7, group: 4, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d² 7s²", shells: [2, 8, 18, 32, 32, 10, 2],
    en: null, radius: null, ie: 580, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [4], year: 1969, disc: "JINR (Dubná) y Laboratorio Berkeley",
    origin: "En honor al físico Ernest Rutherford, descubridor del núcleo atómico.",
    summary: "Primer elemento transactínido (superpesado). Se produce átomo por átomo mediante colisiones nucleares de iones pesados.",
    isPredicted: true
  },
  {
    num: 105, sym: "Db", name: "Dubnio", nameEn: "Dubnium", mass: 268, period: 7, group: 5, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d³ 7s²", shells: [2, 8, 18, 32, 32, 11, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [5], year: 1970, disc: "JINR (Dubná) y Laboratorio Berkeley",
    origin: "Nombrado por la ciudad rusa de Dubná, sede del JINR.",
    summary: "Elemento transactínido de vida media corta. Su química en fase gaseosa muestra similitudes con el tántalo y niobio.",
    isPredicted: true
  },
  {
    num: 106, sym: "Sg", name: "Seaborgio", nameEn: "Seaborgium", mass: 269, period: 7, group: 6, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁴ 7s²", shells: [2, 8, 18, 32, 32, 12, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [6], year: 1974, disc: "Albert Ghiorso et al. (Berkeley)",
    origin: "En honor a Glenn T. Seaborg, pionero de la síntesis de actínidos.",
    summary: "Elemento superpesado sintetizado en ciclotrones. Forma oxicloruros volátiles análogos a los del wolframio y molibdeno.",
    isPredicted: true
  },
  {
    num: 107, sym: "Bh", name: "Bohrio", nameEn: "Bohrium", mass: 270, period: 7, group: 7, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁵ 7s²", shells: [2, 8, 18, 32, 32, 13, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [7], year: 1981, disc: "GSI Darmstadt (Alemania)",
    origin: "En honor al físico cuántico danés Niels Bohr.",
    summary: "Elemento del grupo 7 obtenido por fusión fría. Se desintegra rápidamente mediante emisión alfa con vidas medias de segundos.",
    isPredicted: true
  },
  {
    num: 108, sym: "Hs", name: "Hassio", nameEn: "Hassium", mass: 271, period: 7, group: 8, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁶ 7s²", shells: [2, 8, 18, 32, 32, 14, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [8], year: 1984, disc: "GSI Darmstadt (Alemania)",
    origin: "Del latín 'Hassia' (estado federado de Hesse en Alemania).",
    summary: "Superpesado volátil en forma de tetróxido de hassio (HsO₄), confirmando su pertenencia al grupo 8 junto al osmio.",
    isPredicted: true
  },
  {
    num: 109, sym: "Mt", name: "Meitnerio", nameEn: "Meitnerium", mass: 278, period: 7, group: 9, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁷ 7s²", shells: [2, 8, 18, 32, 32, 15, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [3], year: 1982, disc: "GSI Darmstadt (Alemania)",
    origin: "En honor a Lise Meitner, descubridora de la fisión nuclear.",
    summary: "Se obtiene mediante colisión de bismuto-209 con iones de hierro-58. Decae en segundos hacia elementos más ligeros.",
    isPredicted: true
  },
  {
    num: 110, sym: "Ds", name: "Darmstadtio", nameEn: "Darmstadtium", mass: 281, period: 7, group: 10, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁸ 7s²", shells: [2, 8, 18, 32, 32, 16, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [2, 4], year: 1994, disc: "GSI Darmstadt (Alemania)",
    origin: "En honor a la ciudad alemana de Darmstadt.",
    summary: "Elemento superpesado del grupo 10. Su producción experimental requiere meses de bombardeo continuo con haces acelerados.",
    isPredicted: true
  },
  {
    num: 111, sym: "Rg", name: "Roentgenio", nameEn: "Roentgenium", mass: 282, period: 7, group: 11, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d⁹ 7s²", shells: [2, 8, 18, 32, 32, 17, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [3], year: 1994, disc: "GSI Darmstadt (Alemania)",
    origin: "En honor a Wilhelm Conrad Röntgen, descubridor de los rayos X.",
    summary: "Elemento análogo homólogo del oro, fuertemente afectado por contracciones relativistas de sus orbitales electrónicos.",
    isPredicted: true
  },
  {
    num: 112, sym: "Cn", name: "Copernicio", nameEn: "Copernicium", mass: 285, period: 7, group: 12, block: "d",
    category: "transition-metal", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", shells: [2, 8, 18, 32, 32, 18, 2],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [2], year: 1996, disc: "GSI Darmstadt (Alemania)",
    origin: "En honor al célebre astrónomo polaco Nicolás Copérnico.",
    summary: "Metal volátil que interactúa débilmente con superficies de oro, mostrando propiedades casi de gas noble por efectos relativistas.",
    isPredicted: true
  },
  {
    num: 113, sym: "Nh", name: "Nihonio", nameEn: "Nihonium", mass: 286, period: 7, group: 13, block: "p",
    category: "post-transition-metal", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", shells: [2, 8, 18, 32, 32, 18, 3],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [1, 3], year: 2004, disc: "RIKEN (Japón)",
    origin: "De 'Nihon', nombre tradicional de Japón. Primer elemento sintetizado en Asia.",
    summary: "Se obtuvieron solo 3 átomos concluyentes tras 9 años de colisiones nucleares entre bismuto-209 y cinc-70.",
    isPredicted: true
  },
  {
    num: 114, sym: "Fl", name: "Flerovio", nameEn: "Flerovium", mass: 289, period: 7, group: 14, block: "p",
    category: "post-transition-metal", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", shells: [2, 8, 18, 32, 32, 18, 4],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [2], year: 1998, disc: "JINR (Dubná, Rusia) y LLNL (EE.UU.)",
    origin: "En honor al físico nuclear soviético Georgi Fliórov.",
    summary: "Ubicado en el epicentro de la teórica isla de estabilidad nuclear superpesada. Sus electrones 7p1/2 están fuertemente ligados.",
    isPredicted: true
  },
  {
    num: 115, sym: "Mc", name: "Moscovio", nameEn: "Moscovium", mass: 290, period: 7, group: 15, block: "p",
    category: "post-transition-metal", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", shells: [2, 8, 18, 32, 32, 18, 5],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [1, 3], year: 2003, disc: "JINR (Dubná) y LLNL / Oak Ridge",
    origin: "En honor al Óblast de Moscú, región que alberga al JINR en Dubná.",
    summary: "Sintetizado bombardeando americio-243 con iones de calcio-48. Se desintegra rápidamente hacia nihonio emitiendo radiación alfa.",
    isPredicted: true
  },
  {
    num: 116, sym: "Lv", name: "Livermorio", nameEn: "Livermorium", mass: 293, period: 7, group: 16, block: "p",
    category: "post-transition-metal", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", shells: [2, 8, 18, 32, 32, 18, 6],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [2], year: 2000, disc: "JINR (Dubná) y LLNL (EE.UU.)",
    origin: "En honor a la ciudad de Livermore y al Lawrence Livermore National Laboratory.",
    summary: "Elemento transactínido del grupo 16 sintetizado colisionando curio-248 con núcleos de calcio-48. Vidas medias de milisegundos.",
    isPredicted: true
  },
  {
    num: 117, sym: "Ts", name: "Teneso", nameEn: "Tennessine", mass: 294, period: 7, group: 17, block: "p",
    category: "halogen", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", shells: [2, 8, 18, 32, 32, 18, 7],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [-1, 1, 3], year: 2010, disc: "JINR, LLNL, Oak Ridge y Vanderbilt Univ.",
    origin: "En honor al estado de Tennessee (EE.UU.), hogar de los reactores de Oak Ridge.",
    summary: "El halógeno más pesado. Requirió un año completo de preparación de su blanco de berkelio-249 para lograr fusionar solo 6 átomos.",
    isPredicted: true
  },
  {
    num: 118, sym: "Og", name: "Oganesón", nameEn: "Oganesson", mass: 294, period: 7, group: 18, block: "p",
    category: "noble-gas", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", shells: [2, 8, 18, 32, 32, 18, 8],
    en: null, radius: null, ie: null, ea: null, mp: null, bp: null, density: null, phase: "unknown",
    ox: [0, 2, 4], year: 2002, disc: "JINR (Dubná, Rusia) y LLNL (EE.UU.)",
    origin: "En honor al físico nuclear Yuri Oganessián por sus descubrimientos en elementos transactínidos.",
    summary: "El elemento más masivo conocido. Solo se han producido unos 5 átomos en total. Los efectos cuánticos relativistas sugieren que podría ser un semiconductor o sólido reactivo en lugar de un gas inerte.",
    isPredicted: true
  }
];

// Map into normalized format
const elements = elementsRaw.map(el => ({
  number: el.num,
  symbol: el.sym,
  name: el.name,
  nameEn: el.nameEn,
  atomicMass: el.mass,
  period: el.period,
  group: el.group,
  block: el.block,
  category: el.category,
  electronConfiguration: el.config,
  electronShells: el.shells,
  electronegativity: el.en,
  atomicRadius: el.radius,
  ionizationEnergy: el.ie,
  electronAffinity: el.ea,
  meltingPoint: el.mp,
  boilingPoint: el.bp,
  density: el.density,
  phase: el.phase,
  oxidationStates: el.ox,
  yearDiscovered: el.year,
  discoverer: el.disc,
  nameOrigin: el.origin,
  summary: el.summary,
  isPredicted: !!el.isPredicted
}));

// Build oxidation states dictionary
const oxidationStates = {};
for (const el of elements) {
  oxidationStates[el.symbol] = el.oxidationStates;
}

// Verification checks
if (elements.length !== 118) {
  console.error(`Error: Expected 118 elements, got ${elements.length}`);
  process.exit(1);
}

for (let i = 1; i <= 118; i++) {
  if (elements[i - 1].number !== i) {
    console.error(`Error: Element number mismatch at index ${i - 1}`);
    process.exit(1);
  }
}

const outputPathElements = path.join(__dirname, '..', 'src', 'data', 'elements.json');
const outputPathOxidation = path.join(__dirname, '..', 'src', 'data', 'oxidation-states.json');

fs.writeFileSync(outputPathElements, JSON.stringify(elements, null, 2), 'utf-8');
fs.writeFileSync(outputPathOxidation, JSON.stringify(oxidationStates, null, 2), 'utf-8');

console.log(`Successfully generated ${elements.length} elements to ${outputPathElements}`);
console.log(`Successfully generated oxidation states dictionary to ${outputPathOxidation}`);
