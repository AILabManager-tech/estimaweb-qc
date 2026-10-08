import { describe, expect, it } from "vitest";
import {
  getEffectiveSelection,
  initialState,
  wizardReducer,
  LAST_INPUT_STEP,
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

  it("asks only sector, site type, features and language before the result", () => {
    expect(TOTAL_STEPS).toBe(5);
    expect(LAST_INPUT_STEP).toBe(3);
    expect(initialState).not.toHaveProperty("isUrgent");
    expect(initialState).not.toHaveProperty("projectNature");
  });

  it("supports selection, deselection, result editing and recalculation", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PRO" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PRO02" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result).toMatchObject({ kind: "formule", formule: "croissance" });

    state = wizardReducer(state, { type: "EDIT_ANSWERS" });
    expect(state.currentStep).toBe(0);
    expect(state.result).toBeNull();
    expect(state.siteType).toBe("S01");

    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PRO02" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result).toMatchObject({ kind: "formule", formule: "depart" });
  });

  it("sends a commerce site to a custom quote", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.kind).toBe("soumission");
  });

  it("preselects Law 25 (M08) by default, but lets a client outside Quebec remove it", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    expect(getEffectiveSelection(state).selectedMultipliers).toContain("M08");

    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M08" });
    expect(getEffectiveSelection(state).selectedMultipliers).not.toContain("M08");

    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.selection.multipliers).not.toContain("M08");
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
    expect(state.result?.selection.multipliers).toEqual(["M06", "M11"]);
    expect(state.result).toMatchObject({
      kind: "formule",
      formule: "depart",
      aChiffrer: [
        { kind: "multiplier", id: "M06" },
        { kind: "multiplier", id: "M11" },
      ],
    });
  });

  it("refuses a site type that the sector does not offer", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "JUR" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    expect(state.siteType).toBeNull();
    expect(() => wizardReducer(state, { type: "COMPUTE_RESULT" })).not.toThrow();
  });
});
