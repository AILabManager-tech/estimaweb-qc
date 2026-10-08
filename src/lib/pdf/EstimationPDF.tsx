import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import frMessages from "../../../messages/fr.json";
import enMessages from "../../../messages/en.json";
import {
  ENGAGEMENT_MOIS,
  FRAIS_DE_DEPART,
  OPTIONS_AGENTS_IA,
  type FormuleId,
} from "@/lib/formules/donnees";
import {
  ORDRE_FORMULES,
  formatDatePrixFixes,
  getFormule,
  raisonsNonCouvertes,
  type ElementAChiffrer,
  type ResultatFormule,
} from "@/lib/formules/recommander";

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
  formuleContainer: { flexDirection: "row", gap: 8, marginTop: 7 },
  formuleCard: {
    flex: 1,
    border: "1 solid #D8D1C5",
    borderRadius: 5,
    padding: 9,
    backgroundColor: "#FFFFFF",
  },
  formuleCardRecommandee: { border: "2 solid #165A63" },
  formuleCardAttenuee: { opacity: 0.6 },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 5,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: "#165A63",
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  formuleNom: { fontSize: 12, fontWeight: "bold", color: "#165A63" },
  prix: { marginTop: 4, fontSize: 20, fontWeight: "bold", color: "#202725" },
  parMois: { fontSize: 9, fontWeight: "normal", color: "#53615D" },
  sousLigne: { marginTop: 2, fontSize: 7, color: "#69736F" },
  pages: { marginTop: 4, fontSize: 8.5, fontWeight: "bold" },
  neCouvrePas: { marginTop: 4, fontSize: 7.5, color: "#53615D" },
  inclus: { marginTop: 3, fontSize: 7.5, color: "#53615D" },
  inclusFirst: { marginTop: 6 },
  bullet: { marginBottom: 3, fontSize: 8.5, color: "#202725" },
  bulletNote: { marginBottom: 3, marginLeft: 8, fontSize: 7.5, color: "#53615D" },
  soumission: {
    border: "2 solid #165A63",
    borderRadius: 5,
    padding: 14,
    backgroundColor: "#FFFFFF",
  },
  soumissionTitre: { fontSize: 14, fontWeight: "bold", color: "#165A63" },
  soumissionTexte: { marginTop: 5, fontSize: 9.5, color: "#202725" },
  notes: {
    marginTop: 3,
    border: "1 solid #D8D1C5",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#F4F0E7",
  },
  noteTitle: { marginBottom: 4, fontWeight: "bold", color: "#1F4A3A" },
  noteText: { marginBottom: 3, fontSize: 8, color: "#53615D" },
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
    subtitle: "Formule mensuelle recommandée pour votre site web",
    generated: "Généré le",
    formules: "Les formules",
    sector: "Secteur",
    siteType: "Type de site",
    features: "Fonctionnalités",
    sectorModules: "Modules sectoriels",
    language: "Langues",
    none: "Aucune",
    footer: "EstimaWeb QC — Auxo Systems — auxosystems.ca — Dollars canadiens, avant taxes",
  },
  en: {
    eyebrow: "A free tool by Auxo Systems",
    subtitle: "Recommended monthly plan for your website",
    generated: "Generated on",
    formules: "The plans",
    sector: "Sector",
    siteType: "Site type",
    features: "Features",
    sectorModules: "Sector modules",
    language: "Languages",
    none: "None",
    footer: "EstimaWeb QC — Auxo Systems — auxosystems.ca — Canadian dollars, before taxes",
  },
} as const;

function getRaw(locale: PdfLocale, path: string): unknown {
  let current: unknown = messages[locale];
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Texte des catalogues, avec remplacement des paramètres simples {nom}. */
function getMessage(
  locale: PdfLocale,
  path: string,
  params: Record<string, string | number> = {}
): string {
  const raw = getRaw(locale, path);
  if (typeof raw !== "string") return path;
  return raw.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}

export function getPdfDisclosureCopy(locale: PdfLocale) {
  return {
    pricing: getMessage(locale, "transparency.notes.0", {
      date: formatDatePrixFixes(locale),
    }),
    contract: getMessage(locale, "transparency.notes.1"),
    extras: getMessage(locale, "transparency.notes.2"),
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

function FormuleColumn({
  formule,
  recommandee,
  neCouvrePas,
  locale,
}: {
  formule: FormuleId;
  recommandee: boolean;
  neCouvrePas: string[];
  locale: PdfLocale;
}) {
  const { prixMensuel, pagesMax } = getFormule(formule);
  const inclus = (getRaw(locale, `formules.${formule}.inclus`) as string[] | undefined) ?? [];
  return (
    <View
      style={[
        styles.formuleCard,
        ...(recommandee ? [styles.formuleCardRecommandee] : []),
        ...(neCouvrePas.length > 0 ? [styles.formuleCardAttenuee] : []),
      ]}
    >
      {recommandee && <Text style={styles.badge}>{getMessage(locale, "formules.recommandee")}</Text>}
      <Text style={styles.formuleNom}>{getMessage(locale, `formules.${formule}.nom`)}</Text>
      <Text style={styles.prix}>
        {formatPdfCurrency(prixMensuel, locale)}{" "}
        <Text style={styles.parMois}>{getMessage(locale, "formules.parMois")}</Text>
      </Text>
      <Text style={styles.sousLigne}>
        {getMessage(locale, "formules.sousLigne", {
          mois: ENGAGEMENT_MOIS,
          frais: formatPdfCurrency(FRAIS_DE_DEPART, locale),
        })}
      </Text>
      <Text style={styles.pages}>{getMessage(locale, "formules.pages", { pages: pagesMax })}</Text>
      {neCouvrePas.length > 0 && (
        <Text style={styles.neCouvrePas}>
          {getMessage(locale, "formules.neCouvrePas", { raisons: neCouvrePas.join(", ") })}
        </Text>
      )}
      {inclus.map((item, i) => (
        <Text key={item} style={i === 0 ? [styles.inclus, styles.inclusFirst] : styles.inclus}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

export interface EstimationPDFProps {
  result: ResultatFormule;
  locale: PdfLocale;
  generatedAt?: Date;
}

const CONDITIONS = ["engagement", "propriete", "contenu", "revisions", "pages"] as const;

export function EstimationPDF({
  result,
  locale,
  generatedAt = new Date(),
}: EstimationPDFProps) {
  const { selection } = result;
  const t = PDF_COPY[locale];
  const disclosure = getPdfDisclosureCopy(locale);
  const formattedDate = new Intl.DateTimeFormat(
    locale === "fr" ? "fr-CA" : "en-CA",
    { dateStyle: "long" }
  ).format(generatedAt);
  const featureLabels = selection.multipliers.map((id) =>
    getMessage(locale, `steps.features.${id}.label`)
  );
  const sectorModuleLabels = selection.sectorModules.map((id) =>
    getMessage(locale, `steps.sectorModules.${id}.label`)
  );
  const labelAChiffrer = (element: ElementAChiffrer) =>
    element.kind === "langue"
      ? getMessage(locale, "formules.aChiffrer.langue")
      : getMessage(
          locale,
          element.kind === "multiplier"
            ? `steps.features.${element.id}.label`
            : `steps.sectorModules.${element.id}.label`
        );
  const params = { mois: ENGAGEMENT_MOIS, frais: formatPdfCurrency(FRAIS_DE_DEPART, locale) };

  return (
    <Document title="EstimaWeb QC" author="Auxo Systems" language={locale}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t.eyebrow}</Text>
          <Text style={styles.title}>EstimaWeb QC</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.subtitle}>{t.generated} {formattedDate}</Text>
        </View>

        {result.kind === "formule" ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{t.formules}</Text>
            <View style={styles.formuleContainer}>
              {ORDRE_FORMULES.map((formule) => (
                <FormuleColumn
                  key={formule}
                  formule={formule}
                  recommandee={formule === result.formule}
                  neCouvrePas={raisonsNonCouvertes(result, formule).map((r) =>
                    getMessage(locale, `formules.raisons.${r}`)
                  )}
                  locale={locale}
                />
              ))}
            </View>
            {result.noteCroissance11a15 && (
              <Text style={[styles.bullet, { marginTop: 7 }]}>
                {getMessage(locale, "formules.note11a15")}
              </Text>
            )}
          </View>
        ) : (
          <View style={[styles.section, styles.soumission]} wrap={false}>
            <Text style={styles.soumissionTitre}>{getMessage(locale, "formules.soumission.titre")}</Text>
            <Text style={styles.soumissionTexte}>{getMessage(locale, "formules.soumission.texte")}</Text>
          </View>
        )}

        {result.kind === "formule" && result.aChiffrer.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{getMessage(locale, "formules.aChiffrer.titre")}</Text>
            {result.aChiffrer.map((element) => (
              <View key={element.kind === "langue" ? "langue" : element.id}>
                <Text style={styles.bullet}>• {labelAChiffrer(element)}</Text>
                {element.kind !== "langue" && OPTIONS_AGENTS_IA.includes(element.id) && (
                  <Text style={styles.bulletNote}>{getMessage(locale, "formules.aChiffrer.agentsIa")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>{getMessage(locale, "steps.results.summary.title")}</Text>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.sector}</Text><Text style={styles.inputValue}>{getMessage(locale, `steps.sector.${selection.sector}.label`)}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.siteType}</Text><Text style={styles.inputValue}>{getMessage(locale, `steps.siteType.${selection.siteType}.label`)}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.features}</Text><Text style={styles.inputValue}>{featureLabels.join(", ") || t.none}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.sectorModules}</Text><Text style={styles.inputValue}>{sectorModuleLabels.join(", ") || t.none}</Text></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>{t.language}</Text><Text style={styles.inputValue}>{getMessage(locale, `steps.results.summary.languageModes.${selection.languageMode}`)}</Text></View>
        </View>

        <View style={styles.notes} wrap={false}>
          {result.kind === "formule" && (
            <>
              <Text style={styles.noteTitle}>{getMessage(locale, "formules.conditions.titre")}</Text>
              {CONDITIONS.map((key) => (
                <Text key={key} style={styles.noteText}>• {getMessage(locale, `formules.conditions.${key}`, params)}</Text>
              ))}
            </>
          )}
          <Text style={[styles.noteTitle, { marginTop: 4 }]}>{getMessage(locale, "transparency.title")}</Text>
          <Text style={styles.noteText}>• {disclosure.pricing}</Text>
          <Text style={styles.noteText}>• {disclosure.contract}</Text>
          <Text style={styles.noteText}>• {disclosure.extras}</Text>
        </View>

        <Text style={styles.footer} fixed>{t.footer}</Text>
      </Page>
    </Document>
  );
}
