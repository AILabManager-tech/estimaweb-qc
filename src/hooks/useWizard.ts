"use client";

import { useReducer, useCallback, useMemo } from "react";
import type {
  Sector,
  SiteTypeId,
  MultiplierId,
  SectorModuleId,
  LanguageMode,
} from "@/lib/engine/types";
import {
  isSiteTypeAllowed,
  normalizeCompatibleSelection,
} from "@/lib/engine/compatibility";
import { recommanderFormule, type ResultatFormule } from "@/lib/formules/recommander";

// ── État ────────────────────────────────────────────────────────
// La nature du projet (neuf ou refonte) et l'urgence ne changent pas la
// formule : l'assistant ne les demande plus.
export interface WizardState {
  currentStep: number;
  sector: Sector | null;
  siteType: SiteTypeId | null;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  languageMode: LanguageMode;
  result: ResultatFormule | null;
}

// ── Actions ─────────────────────────────────────────────────────
export type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_SECTOR"; sector: Sector }
  | { type: "SET_SITE_TYPE"; siteType: SiteTypeId }
  | { type: "TOGGLE_MULTIPLIER"; id: MultiplierId }
  | { type: "TOGGLE_SECTOR_MODULE"; id: SectorModuleId }
  | { type: "SET_LANGUAGE_MODE"; languageMode: LanguageMode }
  | { type: "COMPUTE_RESULT" }
  | { type: "EDIT_ANSWERS" }
  | { type: "RESET" };

/** Secteur, type de site, fonctionnalités, langue, résultat. */
export const TOTAL_STEPS = 5;

/** Dernière étape de saisie : passer à la suivante déclenche le calcul. */
export const LAST_INPUT_STEP = TOTAL_STEPS - 2;

export const initialState: WizardState = {
  currentStep: 0,
  sector: null,
  siteType: null,
  // M08 (Loi 25) est présélectionnée : obligation légale québécoise, comprise
  // dans toute formule. Reste décochable pour un client hors Québec.
  selectedMultipliers: ["M08"],
  selectedSectorModules: [],
  languageMode: "single",
  result: null,
};

/**
 * Sélection réellement retenue : l'état conserve l'intention de l'utilisateur,
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

    case "COMPUTE_RESULT": {
      if (!state.sector || !state.siteType) return state;
      const effective = getEffectiveSelection(state);
      // L'intention reste dans l'état; seul le résultat porte la sélection normalisée.
      const result = recommanderFormule({
        sector: state.sector,
        siteType: state.siteType,
        multipliers: effective.selectedMultipliers,
        sectorModules: effective.selectedSectorModules,
        languageMode: state.languageMode,
      });
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
        return true; // fonctionnalités facultatives
      case 3:
        return true; // langue : une valeur par défaut
      default:
        return false; // résultat — pas de « suivant »
    }
  }, [state]);

  const goNext = useCallback(() => {
    if (state.currentStep < TOTAL_STEPS - 1) {
      const nextStep = state.currentStep + 1;
      // Le résultat est calculé à l'arrivée sur la dernière étape.
      if (nextStep === TOTAL_STEPS - 1) {
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
