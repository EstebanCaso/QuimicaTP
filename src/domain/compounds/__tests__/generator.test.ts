import { describe, it, expect } from 'vitest';
import { generateCompounds } from '../generator';
import { balanceBinary, formatFormula, gcd, lcm } from '../balance';

describe('Charge Balance & Mathematics', () => {
  it('calculates GCD and LCM correctly', () => {
    expect(gcd(2, 3)).toBe(1);
    expect(gcd(4, 2)).toBe(2);
    expect(gcd(6, 4)).toBe(2);
    expect(lcm(2, 3)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
  });

  it('balances binary charges with reduction', () => {
    // Fe3+ and O2- -> Fe2O3
    expect(balanceBinary(3, -2)).toEqual({ cationSubscript: 2, anionSubscript: 3 });
    // Fe2+ and O2- -> FeO (reduced from 2:2 to 1:1)
    expect(balanceBinary(2, -2)).toEqual({ cationSubscript: 1, anionSubscript: 1 });
    // C4+ and O2- -> CO2 (reduced from 2:4 to 1:2)
    expect(balanceBinary(4, -2)).toEqual({ cationSubscript: 1, anionSubscript: 2 });
    // Al3+ and Cl- -> AlCl3
    expect(balanceBinary(3, -1)).toEqual({ cationSubscript: 1, anionSubscript: 3 });
    // Ca2+ and Cl- -> CaCl2
    expect(balanceBinary(2, -1)).toEqual({ cationSubscript: 1, anionSubscript: 2 });
  });

  it('formats chemical formulas with unicode subscripts', () => {
    expect(formatFormula('Fe2O3')).toBe('Fe₂O₃');
    expect(formatFormula('H2SO4')).toBe('H₂SO₄');
    expect(formatFormula('Ca(OH)2')).toBe('Ca(OH)₂');
    expect(formatFormula('NaCl')).toBe('NaCl');
  });
});

describe('Compound Generator: Binary Salts & Compounds', () => {
  it('generates NaCl correctly (cloruro de sodio)', () => {
    const res = generateCompounds(['Na', 'Cl']);
    const nacl = res.compounds.find((c) => c.formula === 'NaCl');
    expect(nacl).toBeDefined();
    expect(nacl?.nomenclature.stock).toContain('cloruro de sodio');
    expect(nacl?.bondType).toBe('ionico');
    expect(nacl?.type).toBe('sal-binaria');
  });

  it('generates CaCl2 (dicloruro de calcio / cloruro de calcio)', () => {
    const res = generateCompounds(['Ca', 'Cl']);
    const cacl2 = res.compounds.find((c) => c.formula === 'CaCl2');
    expect(cacl2).toBeDefined();
    expect(cacl2?.nomenclature.stock).toContain('cloruro de calcio');
  });

  it('generates AlCl3 (tricloruro de aluminio)', () => {
    const res = generateCompounds(['Al', 'Cl']);
    const alcl3 = res.compounds.find((c) => c.formula === 'AlCl3');
    expect(alcl3).toBeDefined();
    expect(alcl3?.nomenclature.stock).toContain('cloruro de aluminio');
  });

  it('generates KBr (bromuro de potasio)', () => {
    const res = generateCompounds(['K', 'Br']);
    const kbr = res.compounds.find((c) => c.formula === 'KBr');
    expect(kbr).toBeDefined();
    expect(kbr?.nomenclature.stock).toContain('bromuro de potasio');
  });

  it('generates Na2S (sulfuro de sodio)', () => {
    const res = generateCompounds(['Na', 'S']);
    const na2s = res.compounds.find((c) => c.formula === 'Na2S');
    expect(na2s).toBeDefined();
    expect(na2s?.nomenclature.stock).toContain('sulfuro de sodio');
  });

  it('generates MgCl2 (cloruro de magnesio)', () => {
    const res = generateCompounds(['Mg', 'Cl']);
    const mgcl2 = res.compounds.find((c) => c.formula === 'MgCl2');
    expect(mgcl2).toBeDefined();
    expect(mgcl2?.nomenclature.stock).toContain('cloruro de magnesio');
  });
});

describe('Compound Generator: Oxides with Multiple Valencies', () => {
  it('generates FeO (óxido de hierro(II) / óxido ferroso)', () => {
    const res = generateCompounds(['Fe', 'O']);
    const feo = res.compounds.find((c) => c.formula === 'FeO');
    expect(feo).toBeDefined();
    expect(feo?.nomenclature.stock).toBe('óxido de hierro (II)');
    expect(feo?.nomenclature.traditional).toBe('óxido ferroso');
    expect(feo?.type).toBe('oxido-basico');
  });

  it('generates Fe2O3 (óxido de hierro(III) / óxido férrico)', () => {
    const res = generateCompounds(['Fe', 'O']);
    const fe2o3 = res.compounds.find((c) => c.formula === 'Fe2O3');
    expect(fe2o3).toBeDefined();
    expect(fe2o3?.nomenclature.systematic).toBe('trióxido de dihierro');
    expect(fe2o3?.nomenclature.stock).toBe('óxido de hierro (III)');
    expect(fe2o3?.nomenclature.traditional).toBe('óxido férrico');
  });

  it('generates CO and CO2 (óxidos de carbono)', () => {
    const res = generateCompounds(['C', 'O']);
    const co = res.compounds.find((c) => c.formula === 'CO');
    const co2 = res.compounds.find((c) => c.formula === 'CO2');
    expect(co).toBeDefined();
    expect(co2).toBeDefined();
    expect(co?.nomenclature.systematic).toContain('monóxido de carbono');
    expect(co2?.nomenclature.systematic).toContain('dióxido de carbono');
    expect(co2?.type).toBe('oxido-acido');
  });

  it('generates Al2O3 (trióxido de dialuminio / óxido de aluminio)', () => {
    const res = generateCompounds(['Al', 'O']);
    const al2o3 = res.compounds.find((c) => c.formula === 'Al2O3');
    expect(al2o3).toBeDefined();
    expect(al2o3?.nomenclature.systematic).toBe('trióxido de dialuminio');
  });

  it('generates Na2O and CaO', () => {
    const resNa = generateCompounds(['Na', 'O']);
    expect(resNa.compounds.some((c) => c.formula === 'Na2O')).toBe(true);

    const resCa = generateCompounds(['Ca', 'O']);
    expect(resCa.compounds.some((c) => c.formula === 'CaO')).toBe(true);
  });

  it('generates SO2 and SO3 (anhídridos del azufre)', () => {
    const res = generateCompounds(['S', 'O']);
    const so2 = res.compounds.find((c) => c.formula === 'SO2');
    const so3 = res.compounds.find((c) => c.formula === 'SO3');
    expect(so2).toBeDefined();
    expect(so3).toBeDefined();
    expect(so2?.nomenclature.traditional).toContain('sulfuroso');
    expect(so3?.nomenclature.traditional).toContain('sulfúrico');
  });

  it('generates Cu2O and CuO (óxidos de cobre)', () => {
    const res = generateCompounds(['Cu', 'O']);
    const cu2o = res.compounds.find((c) => c.formula === 'Cu2O');
    const cuo = res.compounds.find((c) => c.formula === 'CuO');
    expect(cu2o).toBeDefined();
    expect(cuo).toBeDefined();
    expect(cu2o?.nomenclature.stock).toContain('(I)');
    expect(cuo?.nomenclature.stock).toContain('(II)');
  });
});

describe('Compound Generator: Hydrides, Hydracids and Special Molecular Compounds', () => {
  it('generates H2O (agua) and H2O2 (peróxido de hidrógeno)', () => {
    const res = generateCompounds(['H', 'O']);
    const h2o = res.compounds.find((c) => c.formula === 'H2O');
    const h2o2 = res.compounds.find((c) => c.formula === 'H2O2');
    expect(h2o).toBeDefined();
    expect(h2o?.nomenclature.traditional).toBe('agua');
    expect(h2o2).toBeDefined();
    expect(h2o2?.nomenclature.common).toBe('agua oxigenada');
    expect(h2o2?.type).toBe('peroxido');
  });

  it('generates NH3 (amoníaco)', () => {
    const res = generateCompounds(['N', 'H']);
    const nh3 = res.compounds.find((c) => c.formula === 'NH3');
    expect(nh3).toBeDefined();
    expect(nh3?.nomenclature.traditional).toBe('amoníaco');
  });

  it('generates CH4 (metano)', () => {
    const res = generateCompounds(['C', 'H']);
    const ch4 = res.compounds.find((c) => c.formula === 'CH4');
    expect(ch4).toBeDefined();
    expect(ch4?.nomenclature.traditional).toBe('metano');
  });

  it('generates HCl (ácido clorhídrico)', () => {
    const res = generateCompounds(['H', 'Cl']);
    const hcl = res.compounds.find((c) => c.formula === 'HCl');
    expect(hcl).toBeDefined();
    expect(hcl?.type).toBe('hidracido');
    expect(hcl?.nomenclature.traditional).toBe('ácido clorhídrico');
  });

  it('generates HF (ácido fluorhídrico)', () => {
    const res = generateCompounds(['H', 'F']);
    const hf = res.compounds.find((c) => c.formula === 'HF');
    expect(hf).toBeDefined();
    expect(hf?.nomenclature.traditional).toBe('ácido fluorhídrico');
  });

  it('generates H2S (ácido sulfhídrico)', () => {
    const res = generateCompounds(['H', 'S']);
    const h2s = res.compounds.find((c) => c.formula === 'H2S');
    expect(h2s).toBeDefined();
    expect(h2s?.nomenclature.traditional).toBe('ácido sulfhídrico');
  });

  it('generates NaH and CaH2 (hidruros metálicos)', () => {
    const resNa = generateCompounds(['Na', 'H']);
    expect(resNa.compounds.some((c) => c.formula === 'NaH')).toBe(true);

    const resCa = generateCompounds(['Ca', 'H']);
    expect(resCa.compounds.some((c) => c.formula === 'CaH2')).toBe(true);
  });
});

describe('Compound Generator: Ternary Hydroxides', () => {
  it('generates NaOH (hidróxido de sodio) from [Na, O, H]', () => {
    const res = generateCompounds(['Na', 'O', 'H']);
    const naoh = res.compounds.find((c) => c.formula === 'NaOH');
    expect(naoh).toBeDefined();
    expect(naoh?.nomenclature.stock).toBe('hidróxido de sodio');
    expect(naoh?.type).toBe('hidroxido');
  });

  it('generates Ca(OH)2 (hidróxido de calcio) from [Ca, O, H]', () => {
    const res = generateCompounds(['Ca', 'O', 'H']);
    const caoh2 = res.compounds.find((c) => c.formula === 'Ca(OH)2');
    expect(caoh2).toBeDefined();
    expect(caoh2?.nomenclature.systematic).toBe('dihidróxido de calcio');
  });

  it('generates Fe(OH)2 and Fe(OH)3 from [Fe, O, H]', () => {
    const res = generateCompounds(['Fe', 'O', 'H']);
    const feoh2 = res.compounds.find((c) => c.formula === 'Fe(OH)2');
    const feoh3 = res.compounds.find((c) => c.formula === 'Fe(OH)3');
    expect(feoh2).toBeDefined();
    expect(feoh3).toBeDefined();
    expect(feoh2?.nomenclature.traditional).toBe('hidróxido ferroso');
    expect(feoh3?.nomenclature.traditional).toBe('hidróxido férrico');
  });

  it('generates Al(OH)3 from [Al, O, H]', () => {
    const res = generateCompounds(['Al', 'O', 'H']);
    const aloh3 = res.compounds.find((c) => c.formula === 'Al(OH)3');
    expect(aloh3).toBeDefined();
    expect(aloh3?.nomenclature.systematic).toBe('trihidróxido de aluminio');
  });

  it('generates KOH from [K, O, H]', () => {
    const res = generateCompounds(['K', 'O', 'H']);
    expect(res.compounds.some((c) => c.formula === 'KOH')).toBe(true);
  });
});

describe('Compound Generator: Ternary Oxoacids', () => {
  it('generates H2SO4 and H2SO3 (ácido sulfúrico y sulfuroso) from [H, S, O]', () => {
    const res = generateCompounds(['H', 'S', 'O']);
    const h2so4 = res.compounds.find((c) => c.formula === 'H2SO4');
    const h2so3 = res.compounds.find((c) => c.formula === 'H2SO3');
    expect(h2so4).toBeDefined();
    expect(h2so3).toBeDefined();
    expect(h2so4?.nomenclature.traditional).toBe('ácido sulfúrico');
    expect(h2so3?.nomenclature.traditional).toBe('ácido sulfuroso');
  });

  it('generates HNO3 and HNO2 (ácido nítrico y nitroso) from [H, N, O]', () => {
    const res = generateCompounds(['H', 'N', 'O']);
    const hno3 = res.compounds.find((c) => c.formula === 'HNO3');
    expect(hno3).toBeDefined();
    expect(hno3?.nomenclature.traditional).toBe('ácido nítrico');
  });

  it('generates H2CO3 (ácido carbónico) from [H, C, O]', () => {
    const res = generateCompounds(['H', 'C', 'O']);
    const h2co3 = res.compounds.find((c) => c.formula === 'H2CO3');
    expect(h2co3).toBeDefined();
    expect(h2co3?.nomenclature.traditional).toBe('ácido carbónico');
  });

  it('generates H3PO4 (ácido fosfórico) from [H, P, O]', () => {
    const res = generateCompounds(['H', 'P', 'O']);
    const h3po4 = res.compounds.find((c) => c.formula === 'H3PO4');
    expect(h3po4).toBeDefined();
    expect(h3po4?.nomenclature.traditional).toBe('ácido fosfórico');
  });

  it('generates HClO and HClO4 (oxoácidos de cloro) from [H, Cl, O]', () => {
    const res = generateCompounds(['H', 'Cl', 'O']);
    expect(res.compounds.some((c) => c.formula === 'HClO')).toBe(true);
    expect(res.compounds.some((c) => c.formula === 'HClO4')).toBe(true);
  });
});

describe('Compound Generator: Ternary Oxysalts', () => {
  it('generates CaCO3 (carbonato de calcio) from [Ca, C, O]', () => {
    const res = generateCompounds(['Ca', 'C', 'O']);
    const caco3 = res.compounds.find((c) => c.formula === 'CaCO3');
    expect(caco3).toBeDefined();
    expect(caco3?.nomenclature.stock).toBe('carbonato de calcio');
    expect(caco3?.type).toBe('oxisal');
  });

  it('generates Na2SO4 (sulfato de sodio) from [Na, S, O]', () => {
    const res = generateCompounds(['Na', 'S', 'O']);
    const na2so4 = res.compounds.find((c) => c.formula === 'Na2SO4');
    expect(na2so4).toBeDefined();
    expect(na2so4?.nomenclature.stock).toBe('sulfato de sodio');
  });

  it('generates KNO3 (nitrato de potasio) from [K, N, O]', () => {
    const res = generateCompounds(['K', 'N', 'O']);
    const kno3 = res.compounds.find((c) => c.formula === 'KNO3');
    expect(kno3).toBeDefined();
    expect(kno3?.nomenclature.stock).toBe('nitrato de potasio');
  });

  it('generates FeSO4 and Fe2(SO4)3 from [Fe, S, O]', () => {
    const res = generateCompounds(['Fe', 'S', 'O']);
    const feso4 = res.compounds.find((c) => c.formula === 'FeSO4');
    const fe2so43 = res.compounds.find((c) => c.formula === 'Fe2(SO4)3');
    expect(feso4).toBeDefined();
    expect(fe2so43).toBeDefined();
    expect(feso4?.nomenclature.stock).toContain('sulfato de hierro (II)');
    expect(fe2so43?.nomenclature.stock).toContain('sulfato de hierro (III)');
  });
});

describe('Compound Generator: Inert Gases & Pure Metal Alloys', () => {
  it('handles noble gases with educational inert explanation', () => {
    const resHe = generateCompounds(['He', 'O']);
    expect(resHe.isInert).toBe(true);
    expect(resHe.compounds.length).toBe(0);
    expect(resHe.message).toContain('gases nobles');

    const resNeAr = generateCompounds(['Ne', 'Ar']);
    expect(resNeAr.isInert).toBe(true);
    expect(resNeAr.compounds.length).toBe(0);
  });

  it('handles pure metal combinations as alloys with informative note', () => {
    const res = generateCompounds(['Cu', 'Zn']);
    expect(res.isAlloyOnly).toBe(true);
    expect(res.compounds.length).toBe(0);
    expect(res.message).toContain('aleaciones');
  });

  it('requires at least 2 elements', () => {
    const res = generateCompounds(['Na']);
    expect(res.compounds.length).toBe(0);
    expect(res.message).toContain('2 o más elementos');
  });
});
