import { describe, expect, it } from "vitest";
import { initialState, wizardReducer } from "../useWizard";

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
    expect(state.selectedMultipliers).not.toContain("M03");
    expect(state.selectedSectorModules).toContain("MED01");
  });

  it("removes included commerce features when the site type changes", () => {
    let state = wizardReducer(initialState, { type: "SET_SECTOR", sector: "PME" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S01" });
    state = wizardReducer(state, { type: "TOGGLE_MULTIPLIER", id: "M11" });
    state = wizardReducer(state, { type: "TOGGLE_SECTOR_MODULE", id: "PME01" });
    state = wizardReducer(state, { type: "SET_SITE_TYPE", siteType: "S03" });
    expect(state.selectedMultipliers).not.toContain("M11");
    expect(state.selectedSectorModules).not.toContain("PME01");
  });
});
