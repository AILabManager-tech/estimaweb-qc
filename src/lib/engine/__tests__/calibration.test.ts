import { describe, it, expect } from "vitest";
import { calculateEstimation, billedOptionRange } from "../calculator";
import { SOCLE_ITEMS_BY_MODE, SOCLE_PROJECT_SHARE } from "../matrix";
import type { CalculatorInput, ProductionMode, SiteTypeId } from "../types";

/**
 * Les trois corrections de structure arbitrées dans `CALIBRATION_MOTEUR.md`.
 * Ce fichier vérifie ce que la correction change, et surtout ce qu'elle ne
 * change pas : le mode généré reste le défaut, et aucun montant publié ne bouge.
 */

const refonte = (over: Partial<CalculatorInput> = {}): CalculatorInput => ({
  sector: "PRO",
  siteType: "S02",
  selectedMultipliers: [],
  selectedSectorModules: [],
  languageMode: "single",
  isUrgent: false,
  projectNature: "refonte",
  codeAuthor: "nous",
  blocsNeufs: 4,
  blocsRhabilles: 6,
  blocsConserves: 21,
  ...over,
});

describe("axe de production", () => {
  it("retient le mode généré quand l'entrée n'en déclare pas", () => {
    const implicite = calculateEstimation({
      sector: "PRO",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "bilingual",
      isUrgent: false,
    });
    const explicite = calculateEstimation({
      sector: "PRO",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "bilingual",
      isUrgent: false,
      productionMode: "genere",
    });
    expect(implicite).toEqual(explicite);
    expect(implicite.inputs.productionMode).toBe("genere");
  });

  it("laisse le montage manuel au-dessus du généré sur les seules lignes repricées", () => {
    const repricees: SiteTypeId[] = ["S01", "S02"];
    const intactes: SiteTypeId[] = ["S03", "S04", "S05", "S06"];
    for (const id of repricees) {
      expect(SOCLE_ITEMS_BY_MODE.surMesure[id].min).toBeGreaterThan(
        SOCLE_ITEMS_BY_MODE.genere[id].min
      );
      expect(SOCLE_ITEMS_BY_MODE.surMesure[id].max).toBeGreaterThan(
        SOCLE_ITEMS_BY_MODE.genere[id].max
      );
    }
    // S03 à S06 sont du travail bespoke ou jamais repricé : aucun effet du
    // générateur, donc aucune raison de les scinder.
    for (const id of intactes) {
      expect(SOCLE_ITEMS_BY_MODE.surMesure[id]).toEqual(SOCLE_ITEMS_BY_MODE.genere[id]);
    }
  });

  it("majore le supplément bilingue en montage manuel, où le FR/EN se duplique", () => {
    const commun = {
      // S03 est réservé au secteur PME.
      sector: "PME",
      siteType: "S03",
      selectedMultipliers: [],
      selectedSectorModules: [],
      isUrgent: false,
    } satisfies Partial<CalculatorInput>;
    // S03 a le même socle dans les deux modes : l'écart observé ne peut venir
    // que du multiplicateur de langue.
    const genere = calculateEstimation({ ...commun, languageMode: "bilingual" });
    const surMesure = calculateEstimation({
      ...commun,
      languageMode: "bilingual",
      productionMode: "surMesure",
    });
    expect(surMesure.rec.multipliersCost).toBeGreaterThan(genere.rec.multipliersCost);

    const unilingue = (mode: ProductionMode) =>
      calculateEstimation({ ...commun, languageMode: "single", productionMode: mode }).rec
        .initialTotal;
    // Hors bilingue, le mode ne change rien sur un socle non scindé.
    expect(unilingue("surMesure")).toBe(unilingue("genere"));
  });
});

describe("scission du socle en part projet et part blocs", () => {
  it("ne dilue plus le travail neuf dans le nombre de blocs conservés", () => {
    // Travail strictement identique, seul le site autour change de taille.
    const petit = calculateEstimation(refonte({ blocsConserves: 0 })).rec.baseCost;
    const grand = calculateEstimation(refonte({ blocsConserves: 90 })).rec.baseCost;

    // Avant la scission, le même travail variait d'un facteur 10 (3 273 $ contre
    // 327 $). La variation résiduelle est voulue — à budget de type de site
    // donné, un site de cent sections a des sections plus légères — mais elle
    // doit rester bornée.
    expect(petit / grand).toBeLessThan(3);

    // Le plancher est la part projet : elle ne se divise jamais.
    const fullBuild =
      (SOCLE_ITEMS_BY_MODE.genere.S02.min + SOCLE_ITEMS_BY_MODE.genere.S02.max) / 2;
    expect(grand).toBeGreaterThan(fullBuild * SOCLE_PROJECT_SHARE);
  });

  it("ne facture aucune part projet quand aucun bloc n'est touché", () => {
    const rienDeRefait = calculateEstimation(
      refonte({ blocsNeufs: 0, blocsRhabilles: 0, blocsConserves: 31 })
    );
    expect(rienDeRefait.rec.baseCost).toBe(0);
    expect(rienDeRefait.rec.initialTotal).toBe(0);
  });

  it("reconstruit exactement le socle quand tous les blocs sont neufs", () => {
    const tousNeufs = calculateEstimation(
      refonte({ blocsNeufs: 12, blocsRhabilles: 0, blocsConserves: 0 })
    );
    const neuf = calculateEstimation({
      sector: "PRO",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      languageMode: "single",
      isUrgent: false,
    });
    // Part projet + part blocs = socle entier : la scission ne crée ni ne perd
    // de montant, elle répartit.
    expect(tousNeufs.rec.baseCost).toBe(neuf.rec.baseCost);
  });
});

describe("règle de non-recouvrement bloc / module", () => {
  const avecModule = (state: "neuf" | "bloc") =>
    calculateEstimation(
      refonte({ selectedSectorModules: ["PRO02"], optionStates: { PRO02: state } })
    );

  it("ne facture pas une option déjà comptée parmi les blocs déclarés", () => {
    expect(avecModule("bloc").rec.sectorModulesCost).toBe(0);
    expect(avecModule("neuf").rec.sectorModulesCost).toBeGreaterThan(0);
  });

  it("conserve l'état déclaré dans le résultat, distinct de `existant`", () => {
    // Les deux valent zéro, mais ne disent pas la même chose : `bloc` décrit du
    // travail qui a lieu et est facturé ailleurs, `existant` du travail qui
    // n'a pas lieu. Le résultat doit rendre la distinction lisible.
    expect(avecModule("bloc").inputs.refonte?.optionStates.PRO02).toBe("bloc");
    expect(billedOptionRange({ min: 2_000, max: 8_000 }, "bloc")).toEqual({ min: 0, max: 0 });
  });

  it("refuse un état hors du mode refonte", () => {
    expect(() =>
      calculateEstimation({
        sector: "PRO",
        siteType: "S02",
        selectedMultipliers: [],
        selectedSectorModules: ["PRO02"],
        languageMode: "single",
        isUrgent: false,
        optionStates: { PRO02: "bloc" },
      })
    ).toThrow();
  });
});
