import { describe, expect, it } from "vitest";
import {
  getEffectiveSelection,
  initialState,
  toCalculatorInput,
  wizardReducer,
  NATURE_STEP,
  TOTAL_STEPS,
} from "../useWizard";

describe("wizard reducer", () => {
  it("resets dependent answers when the sector changes", () => {
    const configured = {
      ...initialState,
      sector: "PME" as const,
      siteType: "S03" as const,
      selectedSectorModules: ["PME03" as const],
    };
    const changed = wizardReducer(configured, { type: "SET_SECTOR", sector: "JUR" });
    expect(changed.siteType).toBeNull();
    expect(changed.selectedSectorModules).toEqual([]);
  });

  it("supports selection, deselection, result editing and recalculation", () => {
    // M08 (Loi 25) est présélectionnée par défaut (voir initialState) : elle
    // reste incluse tout au long de ce scénario, qui teste M09 en plus.
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M09" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PME03" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    const firstTotal = state.result?.rec.initialTotal;
    expect(firstTotal).toBe(9200);

    state = wizardReducer(state, { type: "EDIT_ANSWERS" });
    expect(state.currentStep).toBe(0);
    expect(state.result).toBeNull();
    expect(state.siteType).toBe("S01");

    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M09" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.rec.initialTotal).toBe(6325);
    expect(state.result?.rec.initialTotal).toBeLessThan(firstTotal ?? 0);
  });

  it("preselects Law 25 (M08) by default, but lets a client outside Quebec remove it", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    expect(getEffectiveSelection(state).selectedMultipliers).toContain("M08");

    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M08" });
    expect(getEffectiveSelection(state).selectedMultipliers).not.toContain("M08");

    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.inputs.multipliers).not.toContain("M08");
  });

  it("refuses to compute an incomplete state", () => {
    expect(wizardReducer(initialState, { type: "COMPUTE_RESULT" })).toBe(initialState);
  });

  it("keeps exactly one language mode", () => {
    let state = wizardReducer(initialState, {
      type: "SET_LANGUAGE_MODE",
      languageMode: "bilingual",
    });
    expect(state.languageMode).toBe("bilingual");
    state = wizardReducer(state, {
      type: "SET_LANGUAGE_MODE",
      languageMode: "multilingual",
    });
    expect(state.languageMode).toBe("multilingual");
  });

  it("removes a generic feature when its specialized replacement is selected", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "MED" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M03" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "MED01" });
    const effective = getEffectiveSelection(state);
    expect(effective.selectedMultipliers).not.toContain("M03");
    expect(effective.selectedSectorModules).toContain("MED01");
  });

  it("removes included commerce features when the site type changes", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M11" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PME01" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    const effective = getEffectiveSelection(state);
    expect(effective.selectedMultipliers).not.toContain("M11");
    expect(effective.selectedSectorModules).not.toContain("PME01");
  });

  it("restores an option masked by a site type once that site type is abandoned", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    // Retire M08 (Loi 25, présélectionnée par défaut) pour isoler le comportement
    // testé ici : masquage/restauration de M11 par le changement de type de site.
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M08" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M11" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M06" });

    // Le commerce comprend le paiement : M11 disparaît de la sélection facturée…
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    expect(getEffectiveSelection(state).selectedMultipliers).not.toContain("M11");
    expect(state.selectedMultipliers).toContain("M11"); // …mais l'intention est conservée

    // …et revient si l'utilisateur repart sur une vitrine.
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    expect(getEffectiveSelection(state).selectedMultipliers).toEqual(["M06", "M11"]);

    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.inputs.multipliers).toEqual(["M06", "M11"]);
    expect(state.result?.rec.initialTotal).toBe(11213);
  });

  it("refuses a site type that the sector does not offer", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "JUR" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    expect(state.siteType).toBeNull();
    expect(() => wizardReducer(state, { type: "COMPUTE_RESULT" })).not.toThrow();
  });
});

describe("wizard reducer — mode refonte", () => {
  function refonteState() {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PRO" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S06" });
    state = wizardReducer(state, {
      type: "SET_PROJECT_NATURE",
      projectNature: "refonte",
    });
    state = wizardReducer(state, { type: "SET_BLOC_COUNT", kind: "blocsNeufs", value: 4 });
    state = wizardReducer(state, {
      type: "SET_BLOC_COUNT",
      kind: "blocsRhabilles",
      value: 5,
    });
    return state;
  }

  it("keeps the nature step inside the wizard, before features", () => {
    expect(NATURE_STEP).toBe(2);
    expect(TOTAL_STEPS).toBe(6);
  });

  it("starts as a new build, so an untouched wizard behaves as before", () => {
    expect(initialState.projectNature).toBe("neuf");
    const state = wizardReducer(
      wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" }),
      { type: "SET_SITE_TYPE", siteType: "S01" }
    );
    const input = toCalculatorInput(state, "PME", "S01");
    // Aucun champ de refonte ne doit fuiter dans une estimation en neuf.
    expect(input.projectNature).toBe("neuf");
    expect(input.codeAuthor).toBeUndefined();
    expect(input.blocsNeufs).toBeUndefined();
    expect(input.optionStates).toBeUndefined();
  });

  it("carries the refonte description into the computed result", () => {
    const state = wizardReducer(refonteState(), { type: "COMPUTE_RESULT" });
    expect(state.result?.inputs.projectNature).toBe("refonte");
    expect(state.result?.inputs.refonte).toMatchObject({
      codeAuthor: "nous",
      blocsNeufs: 4,
      blocsRhabilles: 5,
      blocsConserves: 0,
    });
  });

  it("refuses to compute a refonte that describes no block at all", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PRO" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S06" });
    state = wizardReducer(state, {
      type: "SET_PROJECT_NATURE",
      projectNature: "refonte",
    });
    const unchanged = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(unchanged.result).toBeNull();
    expect(unchanged).toBe(state);
  });

  it("normalizes a block count to a non-negative integer", () => {
    let state = wizardReducer(initialState, {
      type: "SET_BLOC_COUNT",
      kind: "blocsNeufs",
      value: -3,
    });
    expect(state.blocsNeufs).toBe(0);
    state = wizardReducer(state, {
      type: "SET_BLOC_COUNT",
      kind: "blocsRhabilles",
      value: 2.7,
    });
    expect(state.blocsRhabilles).toBe(2);
  });

  it("drops an option state once its option leaves the billed selection", () => {
    let state = refonteState();
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PRO02" });
    state = wizardReducer(state, {
      type: "SET_OPTION_STATE",
      id: "PRO02",
      state: "rhabille",
    });
    expect(toCalculatorInput(state, "PRO", "S06").optionStates).toEqual({
      PRO02: "rhabille",
    });

    // L'option est retirée : son état ne doit plus décrire la facture.
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PRO02" });
    expect(toCalculatorInput(state, "PRO", "S06").optionStates).toEqual({});
    // …mais l'intention reste dans l'état, comme pour les options masquées.
    expect(state.optionStates.PRO02).toBe("rhabille");
  });

  it("returns to a clean new build when the user switches back", () => {
    let state = refonteState();
    state = wizardReducer(state, {
      type: "SET_PROJECT_NATURE",
      projectNature: "neuf",
    });
    const input = toCalculatorInput(state, "PRO", "S06");
    expect(input.projectNature).toBe("neuf");
    expect(input.blocsNeufs).toBeUndefined();
    expect(() => wizardReducer(state, { type: "COMPUTE_RESULT" })).not.toThrow();
  });
});
