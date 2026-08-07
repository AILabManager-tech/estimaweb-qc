import { describe, expect, it } from "vitest";
import { getEffectiveSelection, initialState, wizardReducer } from "../useWizard";

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
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M08" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PME03" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    const firstTotal = state.result?.rec.initialTotal;
    expect(firstTotal).toBe(8338);

    state = wizardReducer(state, { type: "EDIT_ANSWERS" });
    expect(state.currentStep).toBe(0);
    expect(state.result).toBeNull();
    expect(state.siteType).toBe("S01");

    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M08" });
    state = wizardReducer(state, { type: "COMPUTE_RESULT" });
    expect(state.result?.rec.initialTotal).toBe(6038);
    expect(state.result?.rec.initialTotal).toBeLessThan(firstTotal ?? 0);
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
    expect(state.result?.rec.initialTotal).toBe(13225);
  });

  it("refuses a site type that the sector does not offer", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "JUR" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    expect(state.siteType).toBeNull();
    expect(() => wizardReducer(state, { type: "COMPUTE_RESULT" })).not.toThrow();
  });
});
