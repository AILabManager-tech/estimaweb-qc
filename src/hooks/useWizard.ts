"use client";

import { useReducer, useCallback, useMemo } from "react";
import type {
  WizardState,
  Sector,
  SiteTypeId,
  MultiplierId,
  SectorModuleId,
  LanguageMode,
} from "@/lib/engine/types";
import { calculateEstimation } from "@/lib/engine/calculator";
import {
  isSiteTypeAllowed,
  normalizeCompatibleSelection,
} from "@/lib/engine/compatibility";

// ── Actions ─────────────────────────────────────────────────────
export type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_SECTOR"; sector: Sector }
  | { type: "SET_SITE_TYPE"; siteType: SiteTypeId }
  | { type: "TOGGLE_MULTIPLIER"; id: MultiplierId }
  | { type: "TOGGLE_SECTOR_MODULE"; id: SectorModuleId }
  | { type: "SET_LANGUAGE_MODE"; languageMode: LanguageMode }
  | { type: "SET_URGENT"; value: boolean }
  | { type: "COMPUTE_RESULT" }
  | { type: "EDIT_ANSWERS" }
  | { type: "RESET" };

export const TOTAL_STEPS = 5;

export const initialState: WizardState = {
  currentStep: 0,
  sector: null,
  siteType: null,
  selectedMultipliers: [],
  selectedSectorModules: [],
  languageMode: "single",
  isUrgent: false,
  result: null,
};

/**
 * Sélection réellement facturée : l'état conserve l'intention de l'utilisateur,
 * la normalisation n'est appliquée qu'à la projection. Une option masquée par un
 * choix ultérieur redevient donc active si ce choix est annulé.
 */
export function getEffectiveSelection(state: WizardState): {
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
} {
  if (!state.sector || !state.siteType) {
    return {
      selectedMultipliers: state.selectedMultipliers,
      selectedSectorModules: state.selectedSectorModules,
    };
  }
  const normalized = normalizeCompatibleSelection({
    sector: state.sector,
    siteType: state.siteType,
    selectedMultipliers: state.selectedMultipliers,
    selectedSectorModules: state.selectedSectorModules,
  });
  return {
    selectedMultipliers: normalized.selectedMultipliers,
    selectedSectorModules: normalized.selectedSectorModules,
  };
}

// ── Reducer ─────────────────────────────────────────────────────
export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };

    case "SET_SECTOR":
      return {
        ...state,
        sector: action.sector,
        siteType: null,
        selectedSectorModules: [],
      };

    case "SET_SITE_TYPE":
      // Un type de site hors du catalogue du secteur ne peut pas entrer dans l'état.
      if (!state.sector || !isSiteTypeAllowed(state.sector, action.siteType)) {
        return state;
      }
      return { ...state, siteType: action.siteType };

    case "TOGGLE_MULTIPLIER": {
      const has = state.selectedMultipliers.includes(action.id);
      return {
        ...state,
        selectedMultipliers: has
          ? state.selectedMultipliers.filter((m) => m !== action.id)
          : [...state.selectedMultipliers, action.id],
      };
    }

    case "TOGGLE_SECTOR_MODULE": {
      const has = state.selectedSectorModules.includes(action.id);
      return {
        ...state,
        selectedSectorModules: has
          ? state.selectedSectorModules.filter((m) => m !== action.id)
          : [...state.selectedSectorModules, action.id],
      };
    }

    case "SET_LANGUAGE_MODE":
      return { ...state, languageMode: action.languageMode };

    case "SET_URGENT":
      return { ...state, isUrgent: action.value };

    case "COMPUTE_RESULT": {
      if (!state.sector || !state.siteType) return state;
      const effective = getEffectiveSelection(state);
      const result = calculateEstimation({
        sector: state.sector,
        siteType: state.siteType,
        selectedMultipliers: effective.selectedMultipliers,
        selectedSectorModules: effective.selectedSectorModules,
        languageMode: state.languageMode,
        isUrgent: state.isUrgent,
      });
      // L'intention reste dans l'état; seul le résultat porte la sélection normalisée.
      return { ...state, result };
    }

    case "EDIT_ANSWERS":
      return { ...state, currentStep: 0, result: null };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ── Hook public ─────────────────────────────────────────────────
export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const effectiveSelection = useMemo(() => getEffectiveSelection(state), [state]);

  const canProceed = useMemo((): boolean => {
    switch (state.currentStep) {
      case 0:
        return state.sector !== null;
      case 1:
        return state.siteType !== null;
      case 2:
        return true; // features are optional
      case 3:
        return true; // extras are optional
      case 4:
        return false; // results — no "next"
      default:
        return false;
    }
  }, [state.currentStep, state.sector, state.siteType]);

  const goNext = useCallback(() => {
    if (state.currentStep < TOTAL_STEPS - 1) {
      const nextStep = state.currentStep + 1;
      // Auto-compute when reaching results
      if (nextStep === 4) {
        dispatch({ type: "COMPUTE_RESULT" });
      }
      dispatch({ type: "SET_STEP", step: nextStep });
    }
  }, [state.currentStep]);

  const goPrev = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({ type: "SET_STEP", step: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const editAnswers = useCallback(() => {
    dispatch({ type: "EDIT_ANSWERS" });
  }, []);

  return {
    state,
    effectiveSelection,
    dispatch,
    canProceed,
    goNext,
    goPrev,
    reset,
    editAnswers,
    totalSteps: TOTAL_STEPS,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === TOTAL_STEPS - 1,
  };
}
