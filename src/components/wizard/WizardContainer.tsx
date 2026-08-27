"use client";

import { useRef, useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useWizard, NATURE_STEP, LAST_INPUT_STEP } from "@/hooks/useWizard";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { ProgressBar } from "./ProgressBar";
import { StepTransition } from "./StepTransition";
import { SectorStep } from "./steps/SectorStep";
import { SiteTypeStep } from "./steps/SiteTypeStep";
import { ProjectNatureStep } from "./steps/ProjectNatureStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { BilingualStep } from "./steps/BilingualStep";
import { ResultsStep } from "./steps/ResultsStep";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function WizardContainer() {
  const { state, effectiveSelection, dispatch, canProceed, goNext, goPrev, reset, editAnswers, totalSteps, isFirstStep, isLastStep } =
    useWizard();
  const { downloadPdf, isGenerating: isPdfGenerating, hasFailed: pdfFailed } = usePdfDownload();
  const locale = useLocale() as "fr" | "en";
  const t = useTranslations("common");
  const tWizard = useTranslations("wizard");
  const [direction, setDirection] = useState(1);
  const prevStep = useRef(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    prevStep.current = state.currentStep;
    goNext();
  }, [goNext, state.currentStep]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    prevStep.current = state.currentStep;
    goPrev();
  }, [goPrev, state.currentStep]);

  const handleReset = useCallback(() => {
    setDirection(-1);
    reset();
  }, [reset]);

  const handleDownloadPdf = useCallback(() => {
    if (state.result) {
      void downloadPdf({ result: state.result, locale });
    }
  }, [downloadPdf, locale, state.result]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <SectorStep
            value={state.sector}
            onChange={(s) => dispatch({ type: "SET_SECTOR", sector: s })}
          />
        );
      case 1:
        return state.sector ? (
          <SiteTypeStep
            value={state.siteType}
            onChange={(s) => dispatch({ type: "SET_SITE_TYPE", siteType: s })}
            sector={state.sector}
          />
        ) : null;
      case NATURE_STEP:
        return (
          <ProjectNatureStep
            projectNature={state.projectNature}
            codeAuthor={state.codeAuthor}
            blocsNeufs={state.blocsNeufs}
            blocsRhabilles={state.blocsRhabilles}
            blocsConserves={state.blocsConserves}
            onSetProjectNature={(projectNature) =>
              dispatch({ type: "SET_PROJECT_NATURE", projectNature })
            }
            onSetCodeAuthor={(codeAuthor) =>
              dispatch({ type: "SET_CODE_AUTHOR", codeAuthor })
            }
            onSetBlocCount={(kind, value) =>
              dispatch({ type: "SET_BLOC_COUNT", kind, value })
            }
          />
        );
      case 3:
        return state.sector ? (
          <FeaturesStep
            sector={state.sector}
            siteType={state.siteType!}
            selectedMultipliers={effectiveSelection.selectedMultipliers}
            selectedSectorModules={effectiveSelection.selectedSectorModules}
            onToggleMultiplier={(id) =>
              dispatch({ type: "TOGGLE_MULTIPLIER", id })
            }
            onToggleSectorModule={(id) =>
              dispatch({ type: "TOGGLE_SECTOR_MODULE", id })
            }
            projectNature={state.projectNature}
            optionStates={state.optionStates}
            onSetOptionState={(id, optionState) =>
              dispatch({ type: "SET_OPTION_STATE", id, state: optionState })
            }
          />
        ) : null;
      case 4:
        return (
          <BilingualStep
            languageMode={state.languageMode}
            isUrgent={state.isUrgent}
            onSetLanguageMode={(languageMode) =>
              dispatch({ type: "SET_LANGUAGE_MODE", languageMode })
            }
            onSetUrgent={(v) => dispatch({ type: "SET_URGENT", value: v })}
          />
        );
      case 5:
        return state.result ? (
          <ResultsStep
            result={state.result}
            onRestart={handleReset}
            onEdit={editAnswers}
            onDownloadPdf={handleDownloadPdf}
            isPdfGenerating={isPdfGenerating}
            pdfFailed={pdfFailed}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={cn("mx-auto w-full space-y-8 px-4", isLastStep ? "max-w-6xl" : "max-w-3xl")}>
      {!isLastStep && (
        <>
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">{tWizard("title")}</span>
            <h2 className="mt-2 text-h2 font-bold text-text-primary">
              {t("appName")}
            </h2>
            <p className="mt-1 text-text-secondary">{tWizard("subtitle")}</p>
          </div>

          <ProgressBar currentStep={state.currentStep} totalSteps={totalSteps} />
        </>
      )}

      <div className="min-h-[400px]">
        <StepTransition stepKey={state.currentStep} direction={direction}>
          {renderStep()}
        </StepTransition>
      </div>

      {!isLastStep && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirstStep}
            aria-label={t("previous")}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </Button>
          <span className="font-mono text-xs text-accent">
            {state.currentStep + 1}/{totalSteps}
          </span>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            aria-label={state.currentStep === LAST_INPUT_STEP ? t("getQuote") : t("next")}
          >
            {state.currentStep === LAST_INPUT_STEP ? t("getQuote") : t("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
