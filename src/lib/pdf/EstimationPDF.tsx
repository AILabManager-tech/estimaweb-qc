import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import frMessages from "../../../messages/fr.json";
import enMessages from "../../../messages/en.json";
import type {
  EstimationResult,
  ScenarioBreakdown,
} from "@/lib/engine/types";

export type PdfLocale = "fr" | "en";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 64,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#202725",
    backgroundColor: "#FBF8F1",
  },
  header: {
    marginBottom: 18,
    borderBottom: "2 solid #1F4A3A",
    paddingBottom: 12,
  },
  eyebrow: {
    color: "#165A63",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 3,
    fontSize: 23,
    fontWeight: "bold",
    color: "#1F4A3A",
  },
  subtitle: { marginTop: 4, fontSize: 10, color: "#53615D" },
  section: { marginBottom: 15 },
  sectionTitle: {
    marginBottom: 7,
    borderBottom: "1 solid #D8D1C5",
    paddingBottom: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F4A3A",
  },
  inputRow: { flexDirection: "row", paddingVertical: 2 },
  inputLabel: { width: 118, color: "#69736F" },
  inputValue: { flex: 1, fontWeight: "bold", color: "#202725" },
  scenarioContainer: { flexDirection: "row", gap: 10, marginTop: 7 },
  scenarioCard: {
    flex: 1,
    border: "1 solid #D8D1C5",
    borderRadius: 5,
    padding: 9,
    backgroundColor: "#FFFFFF",
  },
  scenarioHeader: {
    marginBottom: 5,
    borderBottom: "1 solid #E4DED3",
    paddingBottom: 4,
    fontSize: 11,
    fontWeight: "bold",
    color: "#165A63",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    paddingVertical: 2,
  },
  label: { flex: 1, fontSize: 7.5, color: "#69736F" },
  value: { fontSize: 7.5, fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 4,
    borderTop: "1 solid #D8D1C5",
    paddingTop: 5,
  },
  totalLabel: { flex: 1, fontSize: 8.5, fontWeight: "bold" },
  totalValue: { fontSize: 8.5, fontWeight: "bold", color: "#1F4A3A" },
  notes: {
    marginTop: 3,
    border: "1 solid #D8D1C5",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#F4F0E7",
  },
  noteTitle: { marginBottom: 4, fontWeight: "bold", color: "#1F4A3A" },
  noteText: { marginBottom: 3, fontSize: 8, color: "#53615D" },
  warning: { marginTop: 2, fontSize: 8, fontWeight: "bold", color: "#202725" },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    borderTop: "1 solid #D8D1C5",
    paddingTop: 7,
    textAlign: "center",
    fontSize: 7.5,
    color: "#69736F",
  },
});

const messages = { fr: frMessages, en: enMessages } as const;

export const PDF_COPY = {
  fr: {
    eyebrow: "Un outil gratuit par Auxo Systems",
    subtitle: "Estimation indicative des coûts d’un projet web",
    generated: "Généré le",
    summary: "Résumé du projet",
    sector: "Secteur",
    siteType: "Type de site",
    features: "Fonctionnalités",
    sectorModules: "Modules sectoriels",
    language: "Langues",
    oneLanguage: "Une langue",
    bilingual: "Bilingue (FR/EN)",
    multilingual: "Multilingue (3+ langues)",
    urgent: "Livraison urgente",
    yes: "Oui",
    no: "Non",
    none: "Aucune",
    scenarios: "Trois scénarios",
    base: "Socle de base",
    complexity: "Complexité et fonctionnalités",
    modules: "Modules sectoriels",
    contingency: "Imprévus (15 %)",
    initial: "Réalisation",
    maintenance: "Maintenance / mois",
    thirdParty: "Coûts tiers / mois",
    month: "Total mensuel",
    year1: "Total — année 1",
    recurring: "Récurrent annuel",
    notes: "Notes de transparence",
    footer: "EstimaWeb QC — Auxo Systems — auxosystems.ca — Dollars canadiens, avant taxes",
  },
  en: {
    eyebrow: "A free tool by Auxo Systems",
    subtitle: "Indicative web project cost estimate",
    generated: "Generated on",
    summary: "Project summary",
    sector: "Sector",
    siteType: "Site type",
    features: "Features",
    sectorModules: "Sector modules",
    language: "Languages",
    oneLanguage: "One language",
    bilingual: "Bilingual (FR/EN)",
    multilingual: "Multilingual (3+ languages)",
    urgent: "Urgent delivery",
    yes: "Yes",
    no: "No",
    none: "None",
    scenarios: "Three scenarios",
    base: "Base cost",
    complexity: "Complexity and features",
    modules: "Sector modules",
    contingency: "Contingency (15%)",
    initial: "Initial build",
    maintenance: "Maintenance / month",
    thirdParty: "Third-party costs / month",
    month: "Monthly total",
    year1: "Year 1 total",
    recurring: "Annual recurring",
    notes: "Transparency notes",
    footer: "EstimaWeb QC — Auxo Systems — auxosystems.ca — Canadian dollars, before taxes",
  },
} as const;

function getMessage(locale: PdfLocale, path: string): string {
  let current: unknown = messages[locale];
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function getPdfDisclosureCopy(locale: PdfLocale) {
  return {
    pricing: getMessage(locale, "transparency.notes.0"),
    grid: getMessage(locale, "transparency.notes.1"),
    taxes: getMessage(locale, "transparency.notes.2"),
    thirdParty: getMessage(locale, "transparency.notes.3"),
    recurring: getMessage(locale, "transparency.notes.5"),
    scope: getMessage(locale, "transparency.notes.6"),
    maintenance: getMessage(locale, "transparency.notes.7"),
  };
}

export function formatPdfCurrency(amount: number, locale: PdfLocale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ScenarioColumn({
  name,
  breakdown,
  locale,
}: {
  name: string;
  breakdown: ScenarioBreakdown;
  locale: PdfLocale;
}) {
  const t = PDF_COPY[locale];
  const fmt = (amount: number) => formatPdfCurrency(amount, locale);
  return (
    <View style={styles.scenarioCard}>
      <Text style={styles.scenarioHeader}>{name}</Text>
      <View style={styles.row}><Text style={styles.label}>{t.base}</Text><Text style={styles.value}>{fmt(breakdown.baseCost)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.complexity}</Text><Text style={styles.value}>{fmt(breakdown.multipliersCost)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.modules}</Text><Text style={styles.value}>{fmt(breakdown.sectorModulesCost)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.contingency}</Text><Text style={styles.value}>{fmt(breakdown.contingency)}</Text></View>
      <View style={styles.totalRow}><Text style={styles.totalLabel}>{t.initial}</Text><Text style={styles.totalValue}>{fmt(breakdown.initialTotal)}</Text></View>
      <View style={[styles.row, { marginTop: 5 }]}><Text style={styles.label}>{t.maintenance}</Text><Text style={styles.value}>{fmt(breakdown.maintenanceMonthly)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.thirdParty}</Text><Text style={styles.value}>{fmt(breakdown.thirdPartyMonthly)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.month}</Text><Text style={styles.value}>{fmt(breakdown.monthlyTotal)}</Text></View>
      <View style={styles.totalRow}><Text style={styles.totalLabel}>{t.year1}</Text><Text style={styles.totalValue}>{fmt(breakdown.year1Total)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{t.recurring}</Text><Text style={styles.value}>{fmt(breakdown.annualRecurring)}</Text></View>
    </View>
  );
}

export interface EstimationPDFProps {
  result: EstimationResult;
  locale: PdfLocale;
  generatedAt?: Date;
}

export function EstimationPDF({
  result,
  locale,
  generatedAt = new Date(),
}: EstimationPDFProps) {
  const { inputs } = result;
  const t = PDF_COPY[locale];
  const disclosure = getPdfDisclosureCopy(locale);
  const formattedDate = new Intl.DateTimeFormat(
    locale === "fr" ? "fr-CA" : "en-CA",
    { dateStyle: "long" }
  ).format(generatedAt);
  const featureLabels = inputs.multipliers.map((id) =>
    getMessage(locale, `steps.features.${id}.label`)
  );
  const sectorModuleLabels = inputs.sectorModules.map((id) =>
    getMessage(locale, `steps.sectorModules.${id}.label`)
  );
  const languages =
    inputs.languageMode === "multilingual"
      ? t.multilingual
      : inputs.languageMode === "bilingual"
        ? t.bilingual
        : t.oneLanguage;

  return (
    <Document title="EstimaWeb QC" author="Auxo Systems" language={locale}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t.eyebrow}</Text>
          <Text style={styles.title}>EstimaWeb QC</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.subtitle}>{t.generated} {formattedDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.summary}</Text>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.sector}</Text><Text style={styles.inputValue}>{getMessage(locale, `steps.sector.${inputs.sector}.label`)}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.siteType}</Text><Text style={styles.inputValue}>{getMessage(locale, `steps.siteType.${inputs.siteType}.label`)}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.features}</Text><Text style={styles.inputValue}>{featureLabels.join(", ") || t.none}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.sectorModules}</Text><Text style={styles.inputValue}>{sectorModuleLabels.join(", ") || t.none}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.language}</Text><Text style={styles.inputValue}>{languages}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.urgent}</Text><Text style={styles.inputValue}>{inputs.isUrgent ? t.yes : t.no}</Text></View>
        </View>

        <View style={styles.section} minPresenceAhead={190}>
          <Text style={styles.sectionTitle}>{t.scenarios}</Text>
          <View style={styles.scenarioContainer} wrap={false}>
            <ScenarioColumn name={getMessage(locale, "scenarios.eco.name")} breakdown={result.eco} locale={locale} />
            <ScenarioColumn name={getMessage(locale, "scenarios.rec.name")} breakdown={result.rec} locale={locale} />
            <ScenarioColumn name={getMessage(locale, "scenarios.premium.name")} breakdown={result.premium} locale={locale} />
          </View>
        </View>

        <View style={styles.notes} wrap={false}>
          <Text style={styles.noteTitle}>{t.notes}</Text>
          <Text style={styles.noteText}>• {disclosure.grid}</Text>
          <Text style={styles.noteText}>• {disclosure.taxes}</Text>
          <Text style={styles.noteText}>• {disclosure.thirdParty}</Text>
          <Text style={styles.noteText}>• {disclosure.recurring}</Text>
          <Text style={styles.noteText}>• {disclosure.scope}</Text>
          <Text style={styles.noteText}>• {disclosure.maintenance}</Text>
          <Text style={styles.warning}>{disclosure.pricing}</Text>
        </View>

        <Text style={styles.footer} fixed>{t.footer}</Text>
      </Page>
    </Document>
  );
}
