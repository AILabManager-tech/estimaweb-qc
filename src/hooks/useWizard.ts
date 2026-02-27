"use client";

import { useReducer, useCallback, useMemo } from "react";
import type {
  WizardState,
  Sector,
  SiteTypeId,
  MultiplierId,
  SectorModuleId,
  EstimationResult,
} from "@/lib/engine/types";
import { calculateEstimation } from "@/lib/engine/calculator";

// ── Actions ─────────────────────────────────────────────────────
type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_SECTOR"; sector: Sector }
  | { type: "SET_SITE_TYPE"; siteType: SiteTypeId }
  | { type: "TOGGLE_MULTIPLIER"; id: MultiplierId }
  | { type: "TOGGLE_SECTOR_MODULE"; id: SectorModuleId }
  | { type: "SET_BILINGUAL"; value: boolean }
  | { type: "SET_MULTILINGUAL"; value: boolean }
  | { type: "SET_URGENT"; value: boolean }
  | { type: "SET_CONTACT"; field: keyof WizardState["contact"]; value: string }
  | { type: "COMPUTE_RESULT" }
  | { type: "RESET" };

const TOTAL_STEPS = 6;

const initialState: WizardState = {
  currentStep: 0,
  sector: null,
  siteType: null,
  selectedMultipliers: [],
  selectedSectorModules: [],
  isBilingual: false,
  isMultilingual: false,
  isUrgent: false,
  contact: { name: "", email: "", company: "", phone: "" },
  result: null,
};

// ── Reducer ─────────────────────────────────────────────────────
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
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

    case "SET_BILINGUAL":
      return { ...state, isBilingual: action.value };

    case "SET_MULTILINGUAL":
      return { ...state, isMultilingual: action.value };

    case "SET_URGENT":
      return { ...state, isUrgent: action.value };

    case "SET_CONTACT":
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };

    case "COMPUTE_RESULT": {
      if (!state.sector || !state.siteType) return state;
      const result = calculateEstimation({
        sector: state.sector,
        siteType: state.siteType,
        selectedMultipliers: state.selectedMultipliers,
        selectedSectorModules: state.selectedSectorModules,
        isBilingual: state.isBilingual,
        isMultilingual: state.isMultilingual,
        isUrgent: state.isUrgent,
      });
      return { ...state, result };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ── Hook public ─────────────────────────────────────────────────
export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

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
        return (
          state.contact.name.trim().length > 0 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email)
        );
      case 5:
        return false; // results — no "next"
      default:
        return false;
    }
  }, [state.currentStep, state.sector, state.siteType, state.contact]);

  const goNext = useCallback(() => {
    if (state.currentStep < TOTAL_STEPS - 1) {
      const nextStep = state.currentStep + 1;
      // Auto-compute when reaching results
      if (nextStep === 5) {
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

  return {
    state,
    dispatch,
    canProceed,
    goNext,
    goPrev,
    reset,
    totalSteps: TOTAL_STEPS,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === TOTAL_STEPS - 1,
  };
}
