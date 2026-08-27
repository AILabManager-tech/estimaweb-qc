"use client";

import { useReducer, useCallback, useMemo } from "react";
import type {
  WizardState,
  Sector,
  SiteTypeId,
  MultiplierId,
  SectorModuleId,
  LanguageMode,
  ProjectNature,
  CodeAuthor,
  OptionState,
  OptionStateMap,
  CalculatorInput,
} from "@/lib/engine/types";
import { calculateEstimation } from "@/lib/engine/calculator";
import {
  isSiteTypeAllowed,
  normalizeCompatibleSelection,
} from "@/lib/engine/compatibility";

// ── Actions ─────────────────────────────────────────────────────
export type BlocKind = "blocsNeufs" | "blocsRhabilles" | "blocsConserves";

export type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_SECTOR"; sector: Sector }
  | { type: "SET_SITE_TYPE"; siteType: SiteTypeId }
  | { type: "TOGGLE_MULTIPLIER"; id: MultiplierId }
  | { type: "TOGGLE_SECTOR_MODULE"; id: SectorModuleId }
  | { type: "SET_LANGUAGE_MODE"; languageMode: LanguageMode }
  | { type: "SET_URGENT"; value: boolean }
  | { type: "SET_PROJECT_NATURE"; projectNature: ProjectNature }
  | { type: "SET_CODE_AUTHOR"; codeAuthor: CodeAuthor }
  | { type: "SET_BLOC_COUNT"; kind: BlocKind; value: number }
  | { type: "SET_OPTION_STATE"; id: MultiplierId | SectorModuleId; state: OptionState }
  | { type: "COMPUTE_RESULT" }
  | { type: "EDIT_ANSWERS" }
  | { type: "RESET" };

export const TOTAL_STEPS = 6;

/** Index de l'étape « nature du projet », insérée après le type de site. */
export const NATURE_STEP = 2;
/** Dernière étape de saisie : passer à la suivante déclenche le calcul. */
export const LAST_INPUT_STEP = TOTAL_STEPS - 2;

export const initialState: WizardState = {
  currentStep: 0,
  sector: null,
  siteType: null,
  // M08 (Loi 25) est présélectionnée : obligation légale québécoise, pas une
  // option facultative. Reste décochable pour un client hors Québec.
  selectedMultipliers: ["M08"],
  selectedSectorModules: [],
  languageMode: "single",
  isUrgent: false,
  projectNature: "neuf",
  codeAuthor: "nous",
  blocsNeufs: 0,
  blocsRhabilles: 0,
  blocsConserves: 0,
  optionStates: {},
  result: null,
};

/** Nombre de blocs décrits; une refonte doit en compter au moins un. */
export function totalBlocs(state: WizardState): number {
  return state.blocsNeufs + state.blocsRhabilles + state.blocsConserves;
}

/**
 * Entrée du calculateur. Les champs de refonte ne sont transmis qu'en refonte :
 * l'état conserve l'intention de l'utilisateur, mais une estimation en neuf ne
 * doit porter aucune trace de refonte (le schéma les y refuse).
 */
export function toCalculatorInput(
  state: WizardState,
  sector: Sector,
  siteType: SiteTypeId
): CalculatorInput {
  const effective = getEffectiveSelection(state);
  const base: CalculatorInput = {
    sector,
    siteType,
    selectedMultipliers: effective.selectedMultipliers,
    selectedSectorModules: effective.selectedSectorModules,
    languageMode: state.languageMode,
    isUrgent: state.isUrgent,
    projectNature: state.projectNature,
  };
  if (state.projectNature !== "refonte") return base;

  const billed = new Set<string>([
    ...effective.selectedMultipliers,
    ...effective.selectedSectorModules,
  ]);
  return {
    ...base,
    codeAuthor: state.codeAuthor,
    blocsNeufs: state.blocsNeufs,
    blocsRhabilles: state.blocsRhabilles,
    blocsConserves: state.blocsConserves,
    optionStates: Object.fromEntries(
      Object.entries(state.optionStates).filter(([id]) => billed.has(id))
    ) as OptionStateMap,
  };
}

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

    case "SET_PROJECT_NATURE":
      return { ...state, projectNature: action.projectNature };

    case "SET_CODE_AUTHOR":
      return { ...state, codeAuthor: action.codeAuthor };

    case "SET_BLOC_COUNT": {
      // Un compte de blocs est un entier positif; le reste n'est pas saisissable.
      const value = Math.max(0, Math.floor(action.value));
      if (!Number.isFinite(value)) return state;
      return { ...state, [action.kind]: value };
    }

    case "SET_OPTION_STATE":
      return {
        ...state,
        optionStates: { ...state.optionStates, [action.id]: action.state },
      };

    case "COMPUTE_RESULT": {
      if (!state.sector || !state.siteType) return state;
      // Une refonte qui ne décrit aucun bloc n'est pas calculable.
      if (state.projectNature === "refonte" && totalBlocs(state) === 0) return state;
      const result = calculateEstimation(
        toCalculatorInput(state, state.sector, state.siteType)
      );
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
      case NATURE_STEP:
        // Une refonte doit décrire au moins un bloc; le neuf n'a rien à saisir.
        return state.projectNature !== "refonte" || totalBlocs(state) > 0;
      case 3:
        return true; // features are optional
      case 4:
        return true; // extras are optional
      case 5:
        return false; // results — no "next"
      default:
        return false;
    }
  }, [state]);

  const goNext = useCallback(() => {
    if (state.currentStep < TOTAL_STEPS - 1) {
      const nextStep = state.currentStep + 1;
      // Auto-compute when reaching results
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
