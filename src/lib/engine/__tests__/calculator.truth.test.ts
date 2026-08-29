import { describe, expect, it } from "vitest";
import { billedOptionRange, billedSocleRange, calculateEstimation } from "../calculator";
import { CalculatorInputSchema } from "../schema";
import { ADDITIVE_IDS, MULTIPLIERS, SECTOR_MODULES, SOCLE_ITEMS } from "../matrix";
import { SITE_TYPES_BY_SECTOR } from "../compatibility";
import type {
  CalculatorInput,
  ScenarioBreakdown,
  Sector,
  SiteTypeId,
} from "../types";

const controlledScenarios: Array<{
  name: string;
  input: CalculatorInput;
  expected: Record<"eco" | "rec" | "premium", ScenarioBreakdown>;
}> = [
  {
    name: "small showcase site",
    input: {
      sector: "PME",
      siteType: "S01",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 1500, multipliersCost: 0, sectorModulesCost: 0, contingency: 225, initialTotal: 1725, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 2817, annualRecurring: 1092 },
      rec: { baseCost: 2500, multipliersCost: 0, sectorModulesCost: 0, contingency: 375, initialTotal: 2875, maintenanceMonthly: 113, thirdPartyMonthly: 98, monthlyTotal: 211, year1Total: 5407, annualRecurring: 2532 },
      premium: { baseCost: 3500, multipliersCost: 0, sectorModulesCost: 0, contingency: 525, initialTotal: 4025, maintenanceMonthly: 150, thirdPartyMonthly: 179, monthlyTotal: 329, year1Total: 7973, annualRecurring: 3948 },
    },
  },
  {
    name: "bilingual showcase site",
    input: {
      sector: "JUR",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "bilingual",
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 3000, multipliersCost: 450, sectorModulesCost: 0, contingency: 518, initialTotal: 3968, maintenanceMonthly: 150, thirdPartyMonthly: 16, monthlyTotal: 166, year1Total: 5960, annualRecurring: 1992 },
      rec: { baseCost: 5500, multipliersCost: 1100, sectorModulesCost: 0, contingency: 990, initialTotal: 7590, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 11766, annualRecurring: 4176 },
      premium: { baseCost: 8000, multipliersCost: 2000, sectorModulesCost: 0, contingency: 1500, initialTotal: 11500, maintenanceMonthly: 350, thirdPartyMonthly: 179, monthlyTotal: 529, year1Total: 17848, annualRecurring: 6348 },
    },
  },
  {
    name: "minimum landing page",
    input: {
      sector: "PME",
      siteType: "S06",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 1200, multipliersCost: 0, sectorModulesCost: 0, contingency: 180, initialTotal: 1380, maintenanceMonthly: 50, thirdPartyMonthly: 16, monthlyTotal: 66, year1Total: 2172, annualRecurring: 792 },
      rec: { baseCost: 2350, multipliersCost: 0, sectorModulesCost: 0, contingency: 353, initialTotal: 2703, maintenanceMonthly: 63, thirdPartyMonthly: 98, monthlyTotal: 161, year1Total: 4635, annualRecurring: 1932 },
      premium: { baseCost: 3500, multipliersCost: 0, sectorModulesCost: 0, contingency: 525, initialTotal: 4025, maintenanceMonthly: 75, thirdPartyMonthly: 179, monthlyTotal: 254, year1Total: 7073, annualRecurring: 3048 },
    },
  },
  {
    name: "multilingual urgent landing page",
    input: {
      sector: "PME",
      siteType: "S06",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "multilingual",
      isUrgent: true,
    },
    expected: {
      eco: { baseCost: 1200, multipliersCost: 1608, sectorModulesCost: 0, contingency: 421, initialTotal: 3229, maintenanceMonthly: 50, thirdPartyMonthly: 16, monthlyTotal: 66, year1Total: 4021, annualRecurring: 792 },
      rec: { baseCost: 2350, multipliersCost: 4230, sectorModulesCost: 0, contingency: 987, initialTotal: 7567, maintenanceMonthly: 63, thirdPartyMonthly: 98, monthlyTotal: 161, year1Total: 9499, annualRecurring: 1932 },
      premium: { baseCost: 3500, multipliersCost: 8050, sectorModulesCost: 0, contingency: 1733, initialTotal: 13283, maintenanceMonthly: 75, thirdPartyMonthly: 179, monthlyTotal: 254, year1Total: 16331, annualRecurring: 3048 },
    },
  },
  {
    name: "basic e-commerce with booking, payment and local search",
    input: {
      sector: "PME",
      siteType: "S03",
      selectedMultipliers: ["M03", "M11"],
      selectedSectorModules: ["PME03"],
      languageMode: "bilingual",
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 8000, multipliersCost: 3200, sectorModulesCost: 500, contingency: 1755, initialTotal: 13455, maintenanceMonthly: 150, thirdPartyMonthly: 16, monthlyTotal: 166, year1Total: 15447, annualRecurring: 1992 },
      rec: { baseCost: 16500, multipliersCost: 8300, sectorModulesCost: 1000, contingency: 3870, initialTotal: 29670, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 33846, annualRecurring: 4176 },
      premium: { baseCost: 25000, multipliersCost: 14250, sectorModulesCost: 1500, contingency: 6113, initialTotal: 46863, maintenanceMonthly: 350, thirdPartyMonthly: 179, monthlyTotal: 529, year1Total: 53211, annualRecurring: 6348 },
    },
  },
  {
    name: "custom application with portal, CRM and business integration",
    input: {
      sector: "PRO",
      siteType: "S05",
      selectedMultipliers: ["M04", "M05"],
      selectedSectorModules: ["PRO03"],
      languageMode: "single",
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 25000, multipliersCost: 4500, sectorModulesCost: 2000, contingency: 4725, initialTotal: 36225, maintenanceMonthly: 350, thirdPartyMonthly: 16, monthlyTotal: 366, year1Total: 40617, annualRecurring: 4392 },
      rec: { baseCost: 52500, multipliersCost: 12250, sectorModulesCost: 6000, contingency: 10613, initialTotal: 81363, maintenanceMonthly: 550, thirdPartyMonthly: 98, monthlyTotal: 648, year1Total: 89139, annualRecurring: 7776 },
      premium: { baseCost: 80000, multipliersCost: 20000, sectorModulesCost: 10000, contingency: 16500, initialTotal: 126500, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 137648, annualRecurring: 11148 },
    },
  },
  {
    name: "maximum selectable medical project",
    input: {
      sector: "MED",
      siteType: "S05",
      selectedMultipliers: [...ADDITIVE_IDS],
      selectedSectorModules: SECTOR_MODULES.MED.map((item) => item.id),
      languageMode: "multilingual",
      isUrgent: true,
    },
    expected: {
      eco: { baseCost: 25000, multipliersCost: 42500, sectorModulesCost: 18000, contingency: 12825, initialTotal: 98325, maintenanceMonthly: 350, thirdPartyMonthly: 16, monthlyTotal: 366, year1Total: 102717, annualRecurring: 4392 },
      rec: { baseCost: 52500, multipliersCost: 117000, sectorModulesCost: 38000, contingency: 31125, initialTotal: 238625, maintenanceMonthly: 550, thirdPartyMonthly: 98, monthlyTotal: 648, year1Total: 246401, annualRecurring: 7776 },
      premium: { baseCost: 80000, multipliersCost: 220000, sectorModulesCost: 58000, contingency: 53700, initialTotal: 411700, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 422848, annualRecurring: 11148 },
    },
  },
];

describe("controlled calculation truth table", () => {
  it.each(controlledScenarios)("matches independent totals: $name", ({ input, expected }) => {
    const observed = calculateEstimation(input);
    expect(observed.eco).toEqual(expected.eco);
    expect(observed.rec).toEqual(expected.rec);
    expect(observed.premium).toEqual(expected.premium);
  });

  it("never returns negative, non-finite or internally inconsistent values", () => {
    const sectors = Object.keys(SECTOR_MODULES) as Sector[];
    for (const sector of sectors) {
      for (const siteType of SITE_TYPES_BY_SECTOR[sector] as readonly SiteTypeId[]) {
        const result = calculateEstimation({
          sector,
          siteType,
          selectedMultipliers: [...ADDITIVE_IDS],
          selectedSectorModules: SECTOR_MODULES[sector].map((item) => item.id),
          languageMode: "multilingual",
          isUrgent: true,
        });
        for (const scenario of [result.eco, result.rec, result.premium]) {
          for (const amount of Object.values(scenario)) {
            expect(Number.isFinite(amount)).toBe(true);
            expect(amount).toBeGreaterThanOrEqual(0);
          }
          expect(scenario.year1Total).toBe(scenario.initialTotal + scenario.annualRecurring);
          expect(scenario.annualRecurring).toBe(scenario.monthlyTotal * 12);
          expect(scenario.monthlyTotal).toBe(scenario.maintenanceMonthly + scenario.thirdPartyMonthly);
        }
      }
    }
  });
});

describe("mode refonte", () => {
  // Cas réel de référence : une page d'accueil comptant 4 sections entièrement
  // nouvelles, 5 sections rhabillées et 1 section supprimée (donc non comptée),
  // avec un module « calculateurs/simulateurs » qui existe déjà et n'est que
  // rhabillé.
  const referenceRefonte: CalculatorInput = {
    sector: "PRO",
    siteType: "S06",
    selectedMultipliers: [],
    selectedSectorModules: ["PRO02"],
    languageMode: "bilingual",
    isUrgent: false,
    projectNature: "refonte",
    codeAuthor: "nous",
    blocsNeufs: 4,
    blocsRhabilles: 5,
    blocsConserves: 0,
    optionStates: { PRO02: "rhabille" },
  };

  it("chiffre le cas de référence dans les bornes de contrôle du mandat", () => {
    const { rec } = calculateEstimation(referenceRefonte);
    // Au-dessus de 5 000 $, la refonte ne serait pas prise en compte; en dessous
    // de 1 500 $, le facteur de rhabillage serait trop agressif.
    expect(rec.initialTotal).toBeGreaterThan(1_500);
    expect(rec.initialTotal).toBeLessThan(5_000);
  });

  it("garde le cas de référence stable au centime près", () => {
    const { eco, rec, premium } = calculateEstimation(referenceRefonte);
    expect(eco.initialTotal).toBe(1_501);
    expect(rec.initialTotal).toBe(3_896);
    expect(premium.initialTotal).toBe(7_034);
  });

  it("facture nettement moins qu'une construction neuve équivalente", () => {
    const neuf = calculateEstimation({
      sector: "PRO",
      siteType: "S06",
      selectedMultipliers: [],
      selectedSectorModules: ["PRO02"],
      languageMode: "bilingual",
      isUrgent: false,
    });
    const refonte = calculateEstimation(referenceRefonte);
    expect(refonte.rec.initialTotal).toBeLessThan(neuf.rec.initialTotal);
    expect(refonte.rec.baseCost).toBeLessThan(neuf.rec.baseCost);
  });

  it("ne refacture jamais un bloc ni une option conservés", () => {
    const toutConserve = calculateEstimation({
      ...referenceRefonte,
      blocsNeufs: 0,
      blocsRhabilles: 0,
      blocsConserves: 9,
      optionStates: { PRO02: "existant" },
    });
    // Rien n'est refait : ni socle, ni module, donc aucune marge d'imprévus.
    expect(toutConserve.rec.baseCost).toBe(0);
    expect(toutConserve.rec.sectorModulesCost).toBe(0);
    expect(toutConserve.rec.multipliersCost).toBe(0);
    expect(toutConserve.rec.initialTotal).toBe(0);
  });

  it("place le rhabillage entre le conservé et le neuf, pour un même bloc", () => {
    const base = {
      ...referenceRefonte,
      selectedSectorModules: [],
      optionStates: {},
      blocsNeufs: 0,
      blocsRhabilles: 0,
      blocsConserves: 0,
    } satisfies CalculatorInput;

    const conserve = calculateEstimation({ ...base, blocsConserves: 10 });
    const rhabille = calculateEstimation({ ...base, blocsRhabilles: 10 });
    const neuf = calculateEstimation({ ...base, blocsNeufs: 10 });

    expect(conserve.rec.baseCost).toBe(0);
    expect(rhabille.rec.baseCost).toBeGreaterThan(conserve.rec.baseCost);
    expect(rhabille.rec.baseCost).toBeLessThan(neuf.rec.baseCost);
    // Dix blocs tous neufs reconstruisent exactement le socle du type de site.
    expect(neuf.rec.baseCost).toBe(
      calculateEstimation({ ...base, projectNature: undefined, codeAuthor: undefined, blocsNeufs: undefined, blocsRhabilles: undefined, blocsConserves: undefined, optionStates: undefined }).rec.baseCost
    );
  });

  it("majore le travail sur un code écrit par un tiers", () => {
    const nous = calculateEstimation(referenceRefonte);
    const tiers = calculateEstimation({ ...referenceRefonte, codeAuthor: "tiers" });
    expect(tiers.rec.baseCost).toBeGreaterThan(nous.rec.baseCost);
  });

  it("laisse le forfait de maintenance suivre le type de site, pas la nature", () => {
    const neuf = calculateEstimation({
      sector: "PRO",
      siteType: "S06",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    });
    const refonte = calculateEstimation({
      ...referenceRefonte,
      selectedSectorModules: [],
      optionStates: {},
      languageMode: "single",
    });
    expect(refonte.rec.maintenanceMonthly).toBe(neuf.rec.maintenanceMonthly);
    expect(refonte.rec.thirdPartyMonthly).toBe(neuf.rec.thirdPartyMonthly);
  });
});

describe("l'affiché égale le facturé", () => {
  const refonte: CalculatorInput = {
    sector: "PRO",
    siteType: "S02",
    selectedMultipliers: ["M06"],
    selectedSectorModules: ["PRO02"],
    languageMode: "single",
    isUrgent: false,
    projectNature: "refonte",
    codeAuthor: "nous",
    blocsNeufs: 2,
    blocsRhabilles: 4,
    blocsConserves: 1,
    optionStates: { M06: "existant", PRO02: "rhabille" },
  };

  it("annonce zéro pour une option déjà en place, et ne la facture pas", () => {
    expect(billedOptionRange(MULTIPLIERS.M06.value, "existant")).toEqual({ min: 0, max: 0 });

    const avec = calculateEstimation(refonte);
    const sans = calculateEstimation({
      ...refonte,
      selectedMultipliers: [],
      optionStates: { PRO02: "rhabille" },
    });
    // M06 est sélectionnée mais à l'état « existant » : elle ne doit rien ajouter.
    expect(avec.rec.multipliersCost).toBe(sans.rec.multipliersCost);
    expect(avec.rec.initialTotal).toBe(sans.rec.initialTotal);
  });

  it("annonce pour une option rhabillée exactement ce que les scénarios facturent", () => {
    const pro02 = SECTOR_MODULES.PRO.find((m) => m.id === "PRO02")!;
    const affiche = billedOptionRange(pro02.price, "rhabille");
    const result = calculateEstimation({
      ...refonte,
      selectedMultipliers: [],
      selectedSectorModules: ["PRO02"],
      optionStates: { PRO02: "rhabille" },
    });
    expect(result.eco.sectorModulesCost).toBe(Math.round(affiche.min));
    expect(result.premium.sectorModulesCost).toBe(Math.round(affiche.max));
  });

  it("annonce un socle de refonte égal à celui que le calcul retient", () => {
    const affiche = billedSocleRange(refonte);
    const result = calculateEstimation(refonte);
    expect(result.eco.baseCost).toBe(Math.round(affiche.min));
    expect(result.premium.baseCost).toBe(Math.round(affiche.max));
  });

  it("laisse le socle et les options intacts en construction neuve", () => {
    const neuf: CalculatorInput = {
      sector: "PRO",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    };
    expect(billedSocleRange(neuf)).toEqual(SOCLE_ITEMS.S02);
    expect(billedOptionRange(MULTIPLIERS.M06.value)).toEqual(MULTIPLIERS.M06.value);
  });
});

describe("non-régression du mode neuf", () => {
  it("produit exactement le même résultat avec ou sans nature explicite", () => {
    for (const { input } of controlledScenarios) {
      const implicite = calculateEstimation(input);
      const explicite = calculateEstimation({ ...input, projectNature: "neuf" });
      expect(explicite.eco).toEqual(implicite.eco);
      expect(explicite.rec).toEqual(implicite.rec);
      expect(explicite.premium).toEqual(implicite.premium);
    }
  });
});

describe("validation des entrées de refonte", () => {
  const refonte: CalculatorInput = {
    sector: "PRO",
    siteType: "S06",
    selectedMultipliers: [],
    selectedSectorModules: ["PRO02"],
    languageMode: "single",
    isUrgent: false,
    projectNature: "refonte",
    codeAuthor: "nous",
    blocsNeufs: 2,
    blocsRhabilles: 1,
    blocsConserves: 0,
  };

  it("accepts a coherent refonte input", () => {
    expect(() => CalculatorInputSchema.parse(refonte)).not.toThrow();
  });

  it.each([
    // Champs de refonte manquants.
    { ...refonte, codeAuthor: undefined },
    { ...refonte, blocsNeufs: undefined },
    { ...refonte, blocsRhabilles: undefined },
    { ...refonte, blocsConserves: undefined },
    // Une refonte sans aucun bloc ne décrit rien.
    { ...refonte, blocsNeufs: 0, blocsRhabilles: 0, blocsConserves: 0 },
    // Comptes de blocs incohérents.
    { ...refonte, blocsNeufs: -1 },
    { ...refonte, blocsRhabilles: 1.5 },
    // Un état porté par une option non sélectionnée.
    { ...refonte, optionStates: { PRO05: "rhabille" } },
    // Champs de refonte fournis en construction neuve.
    { ...refonte, projectNature: "neuf" as const, codeAuthor: "nous" as const },
  ])("rejects incoherent refonte inputs", (input) => {
    expect(() => CalculatorInputSchema.parse(input)).toThrow();
    expect(() => calculateEstimation(input as CalculatorInput)).toThrow();
  });
});

describe("plausibilité économique des récurrents", () => {
  it("le récurrent annuel reste inférieur à la réalisation, sur tout le catalogue", () => {
    const offenders: string[] = [];
    for (const sector of Object.keys(SECTOR_MODULES) as Sector[]) {
      for (const siteType of SITE_TYPES_BY_SECTOR[sector] as readonly SiteTypeId[]) {
        const result = calculateEstimation({
          sector,
          siteType,
          selectedMultipliers: [],
          selectedSectorModules: [],
          languageMode: "single",
          isUrgent: false,
        });
        for (const [name, scenario] of Object.entries({
          eco: result.eco,
          rec: result.rec,
          premium: result.premium,
        })) {
          const ratio = scenario.annualRecurring / scenario.initialTotal;
          if (ratio >= 1) {
            offenders.push(`${sector}/${siteType}/${name} = ${ratio.toFixed(2)}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("le forfait de maintenance suit l'ampleur du projet, pas le scénario", () => {
    const landing = calculateEstimation({
      sector: "PME",
      siteType: "S06",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    });
    const platform = calculateEstimation({
      sector: "PME",
      siteType: "S05",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    });
    // ABN00 (50-75) pour une landing page, ABN03 (350-750) pour une plateforme
    expect(landing.premium.maintenanceMonthly).toBe(75);
    expect(platform.eco.maintenanceMonthly).toBe(350);
    expect(landing.premium.maintenanceMonthly).toBeLessThan(
      platform.eco.maintenanceMonthly
    );
  });
});

describe("intégrité arithmétique de la grille", () => {
  it("chaque ligne affichée s'additionne exactement au total montré", () => {
    for (const sector of Object.keys(SECTOR_MODULES) as Sector[]) {
      for (const siteType of SITE_TYPES_BY_SECTOR[sector] as readonly SiteTypeId[]) {
        for (const languageMode of ["single", "bilingual", "multilingual"] as const) {
          for (const isUrgent of [false, true]) {
            const result = calculateEstimation({
              sector,
              siteType,
              selectedMultipliers: [...ADDITIVE_IDS],
              selectedSectorModules: SECTOR_MODULES[sector].map((item) => item.id),
              languageMode,
              isUrgent,
            });
            for (const scenario of [result.eco, result.rec, result.premium]) {
              expect(
                scenario.baseCost +
                  scenario.multipliersCost +
                  scenario.sectorModulesCost +
                  scenario.contingency
              ).toBe(scenario.initialTotal);
            }
          }
        }
      }
    }
  });

  it("s'additionne aussi en refonte, où le socle tombe sur des fractions", () => {
    // Le socle divisé par le nombre de blocs produit presque toujours une
    // fraction : c'est exactement le cas que l'invariant en mode neuf ne pouvait
    // pas révéler, puisque la grille y garantit des sous-totaux entiers.
    const offenders: string[] = [];
    for (const sector of Object.keys(SECTOR_MODULES) as Sector[]) {
      for (const siteType of SITE_TYPES_BY_SECTOR[sector] as readonly SiteTypeId[]) {
        for (const blocs of [
          { blocsNeufs: 2, blocsRhabilles: 3, blocsConserves: 2 },
          { blocsNeufs: 1, blocsRhabilles: 1, blocsConserves: 1 },
          { blocsNeufs: 4, blocsRhabilles: 5, blocsConserves: 0 },
          { blocsNeufs: 7, blocsRhabilles: 0, blocsConserves: 0 },
        ]) {
          for (const codeAuthor of ["nous", "tiers"] as const) {
            for (const languageMode of ["single", "bilingual", "multilingual"] as const) {
              const modules = SECTOR_MODULES[sector].map((m) => m.id);
              const result = calculateEstimation({
                sector,
                siteType,
                selectedMultipliers: [...ADDITIVE_IDS],
                selectedSectorModules: modules,
                languageMode,
                isUrgent: false,
                projectNature: "refonte",
                codeAuthor,
                ...blocs,
                optionStates: Object.fromEntries([
                  ...ADDITIVE_IDS.map((id, i) => [id, i % 3 === 0 ? "rhabille" : i % 3 === 1 ? "existant" : "neuf"]),
                  ...modules.map((id, i) => [id, i % 2 === 0 ? "rhabille" : "neuf"]),
                ]),
              });
              for (const [name, s] of Object.entries({
                eco: result.eco,
                rec: result.rec,
                premium: result.premium,
              })) {
                const somme =
                  s.baseCost + s.multipliersCost + s.sectorModulesCost + s.contingency;
                if (somme !== s.initialTotal) {
                  offenders.push(
                    `${sector}/${siteType}/${codeAuthor}/${languageMode}/${name}: ${somme} ≠ ${s.initialTotal}`
                  );
                }
                if (s.year1Total !== s.initialTotal + s.annualRecurring) {
                  offenders.push(`${sector}/${siteType}/${name}: année 1 incohérente`);
                }
              }
            }
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("toute valeur de la grille produit un sous-total entier (prérequis de l'invariant)", () => {
    const fractional: string[] = [];
    const halves = [
      ...Object.values(SOCLE_ITEMS),
      ...Object.values(MULTIPLIERS).filter((m) => m.type === "ajout_fixe").map((m) => m.value),
      ...Object.values(SECTOR_MODULES).flat().map((m) => m.price),
    ];
    for (const range of halves) {
      if (!Number.isInteger((range.min + range.max) / 2)) {
        fractional.push(`${range.min}-${range.max}`);
      }
    }
    expect(fractional).toEqual([]);
  });
});

describe("calculator input validation", () => {
  const valid: CalculatorInput = controlledScenarios[0].input;

  it("accepts a valid strict input and defaults its nature to neuf", () => {
    expect(CalculatorInputSchema.parse(valid)).toEqual({
      ...valid,
      projectNature: "neuf",
    });
  });

  it.each([
    { ...valid, selectedMultipliers: ["M03", "M03"] },
    { ...valid, selectedSectorModules: ["JUR01"] },
    { ...valid, sector: "OTHER" },
    { ...valid, selectedMultipliers: ["M01"] },
    { ...valid, unexpected: true },
  ])("rejects invalid or incoherent inputs", (input) => {
    expect(() => CalculatorInputSchema.parse(input)).toThrow();
    expect(() => calculateEstimation(input as CalculatorInput)).toThrow();
  });
});
