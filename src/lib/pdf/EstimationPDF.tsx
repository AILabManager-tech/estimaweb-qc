import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { EstimationResult, ScenarioBreakdown } from "@/lib/engine/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1F2937",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #F59E0B",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B1120",
  },
  subtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0B1120",
    marginBottom: 8,
    borderBottom: "1 solid #E5E7EB",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  label: { fontSize: 9, color: "#6B7280" },
  value: { fontSize: 9, fontWeight: "bold" },
  scenarioContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  scenarioCard: {
    flex: 1,
    border: "1 solid #E5E7EB",
    borderRadius: 6,
    padding: 10,
  },
  scenarioHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1 solid #E5E7EB",
  },
  ecoHeader: { color: "#10B981" },
  recHeader: { color: "#F59E0B" },
  premiumHeader: { color: "#EF4444" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderTop: "1 solid #E5E7EB",
    marginTop: 4,
  },
  totalLabel: { fontSize: 10, fontWeight: "bold" },
  totalValue: { fontSize: 10, fontWeight: "bold", color: "#F59E0B" },
  inputsSection: { marginBottom: 16 },
  inputRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  inputLabel: { fontSize: 9, color: "#6B7280", width: 120 },
  inputValue: { fontSize: 9, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
    borderTop: "1 solid #E5E7EB",
    paddingTop: 8,
  },
  notes: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
  },
  noteText: {
    fontSize: 8,
    color: "#6B7280",
    marginBottom: 3,
  },
});

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(n);
}

function ScenarioColumn({
  name,
  headerStyle,
  breakdown,
}: {
  name: string;
  headerStyle: Style;
  breakdown: ScenarioBreakdown;
}) {
  return (
    <View style={styles.scenarioCard}>
      <Text style={[styles.scenarioHeader, headerStyle]}>{name}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Socle</Text>
        <Text style={styles.value}>{fmt(breakdown.baseCost)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Multiplicateurs</Text>
        <Text style={styles.value}>{fmt(breakdown.multipliersCost)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Modules sectoriels</Text>
        <Text style={styles.value}>{fmt(breakdown.sectorModulesCost)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Imprévus (15%)</Text>
        <Text style={styles.value}>{fmt(breakdown.contingency)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Réalisation</Text>
        <Text style={styles.totalValue}>{fmt(breakdown.initialTotal)}</Text>
      </View>
      <View style={[styles.row, { marginTop: 6 }]}>
        <Text style={styles.label}>Maintenance/mois</Text>
        <Text style={styles.value}>{fmt(breakdown.maintenanceMonthly)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tiers/mois</Text>
        <Text style={styles.value}>{fmt(breakdown.thirdPartyMonthly)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Année 1</Text>
        <Text style={styles.totalValue}>{fmt(breakdown.year1Total)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Récurrent annuel</Text>
        <Text style={styles.value}>{fmt(breakdown.annualRecurring)}</Text>
      </View>
    </View>
  );
}

interface EstimationPDFProps {
  result: EstimationResult;
  contactName?: string;
  contactCompany?: string;
}

export function EstimationPDF({
  result,
  contactName,
  contactCompany,
}: EstimationPDFProps) {
  const { inputs } = result;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EstimaWeb QC</Text>
          <Text style={styles.subtitle}>
            Estimation de coûts web — {contactCompany || ""}
          </Text>
        </View>

        {/* Inputs summary */}
        <View style={styles.inputsSection}>
          <Text style={styles.sectionTitle}>Résumé du projet</Text>
          {contactName && (
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Contact</Text>
              <Text style={styles.inputValue}>{contactName}</Text>
            </View>
          )}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Secteur</Text>
            <Text style={styles.inputValue}>{inputs.sector}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Type de site</Text>
            <Text style={styles.inputValue}>{inputs.siteType}</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Bilingue</Text>
            <Text style={styles.inputValue}>
              {inputs.isBilingual ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Urgence</Text>
            <Text style={styles.inputValue}>
              {inputs.isUrgent ? "Oui" : "Non"}
            </Text>
          </View>
        </View>

        {/* 3 Scenarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trois scénarios</Text>
          <View style={styles.scenarioContainer}>
            <ScenarioColumn
              name="Économique"
              headerStyle={styles.ecoHeader}
              breakdown={result.eco}
            />
            <ScenarioColumn
              name="Recommandé"
              headerStyle={styles.recHeader}
              breakdown={result.rec}
            />
            <ScenarioColumn
              name="Premium"
              headerStyle={styles.premiumHeader}
              breakdown={result.premium}
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={[styles.noteText, { fontWeight: "bold" }]}>
            Notes de transparence
          </Text>
          <Text style={styles.noteText}>
            • Ces montants sont des fourchettes indicatives, pas un devis ferme.
          </Text>
          <Text style={styles.noteText}>
            • Le marché web québécois est variable (±40-50% selon le
            prestataire).
          </Text>
          <Text style={styles.noteText}>
            • Les coûts tiers sont payés directement par le client.
          </Text>
          <Text style={styles.noteText}>
            • Le ROI d'un site professionnel se mesure sur 2-3 ans.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          EstimaWeb QC — Propulsé par Mark Systems | marksystems.ca | Données
          calibrées marché QC 2025
        </Text>
      </Page>
    </Document>
  );
}
