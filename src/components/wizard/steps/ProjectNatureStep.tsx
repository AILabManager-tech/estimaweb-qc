"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { BlocKind } from "@/hooks/useWizard";
import type { CodeAuthor, ProjectNature } from "@/lib/engine/types";

interface ProjectNatureStepProps {
  projectNature: ProjectNature;
  codeAuthor: CodeAuthor;
  blocsNeufs: number;
  blocsRhabilles: number;
  blocsConserves: number;
  onSetProjectNature: (nature: ProjectNature) => void;
  onSetCodeAuthor: (author: CodeAuthor) => void;
  onSetBlocCount: (kind: BlocKind, value: number) => void;
}

const BLOC_FIELDS = [
  { kind: "blocsNeufs", key: "neufs" },
  { kind: "blocsRhabilles", key: "rhabilles" },
  { kind: "blocsConserves", key: "conserves" },
] as const satisfies ReadonlyArray<{ kind: BlocKind; key: string }>;

export function ProjectNatureStep({
  projectNature,
  codeAuthor,
  blocsNeufs,
  blocsRhabilles,
  blocsConserves,
  onSetProjectNature,
  onSetCodeAuthor,
  onSetBlocCount,
}: ProjectNatureStepProps) {
  const t = useTranslations("steps.nature");
  const counts: Record<BlocKind, number> = {
    blocsNeufs,
    blocsRhabilles,
    blocsConserves,
  };
  const total = blocsNeufs + blocsRhabilles + blocsConserves;
  const isRefonte = projectNature === "refonte";

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {t("eyebrow")}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </div>

      <RadioGroup
        options={[
          {
            value: "neuf",
            label: t("nature.neuf.label"),
            description: t("nature.neuf.description"),
          },
          {
            value: "refonte",
            label: t("nature.refonte.label"),
            description: t("nature.refonte.description"),
          },
        ]}
        value={projectNature}
        onChange={(v) => onSetProjectNature(v as ProjectNature)}
        columns={2}
        ariaLabel={t("title")}
      />

      {/* Les détails de refonte n'apparaissent qu'une fois un site existant déclaré. */}
      {isRefonte && (
        <div className="space-y-6 border-t border-surface-border pt-6">
          <div>
            <h3 className="mb-1 text-sm font-semibold text-text-primary">
              {t("blocs.label")}
            </h3>
            <p className="mb-3 text-xs text-text-secondary">
              {t("blocs.help")}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {BLOC_FIELDS.map(({ kind, key }) => (
                <label
                  key={kind}
                  className="rounded-sm border border-surface-border bg-surface p-4"
                >
                  <span className="block text-sm font-medium text-text-primary">
                    {t(`blocs.${key}.label`)}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-secondary">
                    {t(`blocs.${key}.description`)}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    value={counts[kind]}
                    onChange={(e) =>
                      onSetBlocCount(kind, Number(e.target.value))
                    }
                    className="mt-3 w-full rounded-sm border border-surface-border bg-background px-3 py-2 font-mono text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>
              ))}
            </div>
            {total === 0 && (
              <p role="alert" className="mt-3 text-xs font-medium text-accent">
                {t("blocs.required")}
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              {t("codeAuthor.label")}
            </h3>
            <RadioGroup
              options={[
                {
                  value: "nous",
                  label: t("codeAuthor.nous.label"),
                  description: t("codeAuthor.nous.description"),
                },
                {
                  value: "tiers",
                  label: t("codeAuthor.tiers.label"),
                  description: t("codeAuthor.tiers.description"),
                },
              ]}
              value={codeAuthor}
              onChange={(v) => onSetCodeAuthor(v as CodeAuthor)}
              columns={2}
              ariaLabel={t("codeAuthor.label")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
