"use client";

import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useWizard } from "@/hooks/useWizard";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { ProgressBar } from "./ProgressBar";
import { StepTransition } from "./StepTransition";
import { SectorStep } from "./steps/SectorStep";
import { SiteTypeStep } from "./steps/SiteTypeStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { BilingualStep } from "./steps/BilingualStep";
import { LeadCaptureStep } from "./steps/LeadCaptureStep";
import { ResultsStep } from "./steps/ResultsStep";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WizardState } from "@/lib/engine/types";

export function WizardContainer() {
  const { state, dispatch, canProceed, goNext, goPrev, reset, totalSteps, isFirstStep, isLastStep } =
    useWizard();
  const { downloadPdf } = usePdfDownload();
  const t = useTranslations("common");
  const tWizard = useTranslations("wizard");
  const tValidation = useTranslations("validation");
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

  const contactErrors: Partial<Record<keyof WizardState["contact"], string>> = {};
  if (state.currentStep === 4) {
    if (!state.contact.name.trim()) contactErrors.name = tValidation("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email))
      contactErrors.email = tValidation("email");
  }

  const handleDownloadPdf = useCallback(() => {
    if (state.result) {
      downloadPdf({
        result: state.result,
        contactName: state.contact.name,
        contactCompany: state.contact.company,
      });
    }
  }, [downloadPdf, state.result, state.contact]);

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
      case 2:
        return state.sector ? (
          <FeaturesStep
            sector={state.sector}
            selectedMultipliers={state.selectedMultipliers}
            selectedSectorModules={state.selectedSectorModules}
            onToggleMultiplier={(id) =>
              dispatch({ type: "TOGGLE_MULTIPLIER", id })
            }
            onToggleSectorModule={(id) =>
              dispatch({ type: "TOGGLE_SECTOR_MODULE", id })
            }
          />
        ) : null;
      case 3:
        return (
          <BilingualStep
            isBilingual={state.isBilingual}
            isMultilingual={state.isMultilingual}
            isUrgent={state.isUrgent}
            onSetBilingual={(v) =>
              dispatch({ type: "SET_BILINGUAL", value: v })
            }
            onSetMultilingual={(v) =>
              dispatch({ type: "SET_MULTILINGUAL", value: v })
            }
            onSetUrgent={(v) => dispatch({ type: "SET_URGENT", value: v })}
          />
        );
      case 4:
        return (
          <LeadCaptureStep
            contact={state.contact}
            onSetContact={(field, value) =>
              dispatch({ type: "SET_CONTACT", field, value })
            }
            errors={contactErrors}
          />
        );
      case 5:
        return state.result ? (
          <ResultsStep
            result={state.result}
            onRestart={handleReset}
            onDownloadPdf={handleDownloadPdf}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4">
      {!isLastStep && (
        <>
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              {"// "}
              {tWizard("title")}
            </span>
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
            aria-label={t("next")}
          >
            {state.currentStep === 4 ? t("getQuote") : t("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
