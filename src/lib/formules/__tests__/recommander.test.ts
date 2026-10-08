import { describe, expect, it } from "vitest";
import fr from "../../../../messages/fr.json";
import en from "../../../../messages/en.json";
import { ADDITIVE_IDS, SECTOR_MODULES } from "@/lib/engine/matrix";
import { EFFET_OPTIONS, FORMULES, type RaisonId } from "../donnees";
import {
  raisonsNonCouvertes,
  recommanderFormule,
  type ResultatFormule,
  type SelectionFormule,
} from "../recommander";

function selection(partial: Partial<SelectionFormule> = {}): SelectionFormule {
  return {
    sector: "PRO",
    siteType: "S01",
    multipliers: [],
    sectorModules: [],
    languageMode: "single",
    ...partial,
  };
}

function formule(r: ResultatFormule) {
  if (r.kind !== "formule") throw new Error("résultat sur soumission inattendu");
  return r;
}

describe("prix des formules (page d'offre)", () => {
  it("garde les trois prix mensuels publiés", () => {
    expect(FORMULES.map((f) => [f.id, f.prixMensuel, f.pagesMax])).toEqual([
      ["depart", 249, 5],
      ["pro", 399, 10],
      ["croissance", 899, 15],
    ]);
  });
});

describe("correspondance projet → formule", () => {
  it("S01 sans option → Départ", () => {
    const r = formule(recommanderFormule(selection()));
    expect(r.formule).toBe("depart");
    expect(r.aChiffrer).toEqual([]);
  });

  it("S06 (landing) → Départ", () => {
    expect(formule(recommanderFormule(selection({ siteType: "S06" }))).formule).toBe("depart");
  });

  it("S01 + PRO02 → Croissance, Départ et Pro ne couvrent pas l'outil interactif", () => {
    const r = formule(recommanderFormule(selection({ sectorModules: ["PRO02"] })));
    expect(r.formule).toBe("croissance");
    expect(raisonsNonCouvertes(r, "depart")).toEqual(["outilInteractif"]);
    expect(raisonsNonCouvertes(r, "pro")).toEqual(["outilInteractif"]);
    expect(raisonsNonCouvertes(r, "croissance")).toEqual([]);
  });

  it("S02 → Pro, avec la mention 11 à 15 pages", () => {
    const r = formule(recommanderFormule(selection({ siteType: "S02" })));
    expect(r.formule).toBe("pro");
    expect(r.noteCroissance11a15).toBe(true);
    expect(raisonsNonCouvertes(r, "depart")).toEqual(["plusDe5Pages"]);
  });

  it("S01 + M12 → Pro", () => {
    const r = formule(recommanderFormule(selection({ multipliers: ["M12"] })));
    expect(r.formule).toBe("pro");
    expect(r.noteCroissance11a15).toBe(false);
  });

  it("S01 + PME03 → Pro", () => {
    const r = formule(
      recommanderFormule(selection({ sector: "PME", sectorModules: ["PME03"] }))
    );
    expect(r.formule).toBe("pro");
  });

  it.each(["S03", "S04", "S05"] as const)("%s → sur soumission", (siteType) => {
    const r = recommanderFormule(selection({ sector: "PME", siteType }));
    expect(r.kind).toBe("soumission");
  });

  it("S01 + M05 → Départ, avec l'intégration CRM à chiffrer", () => {
    const r = formule(recommanderFormule(selection({ multipliers: ["M05"] })));
    expect(r.formule).toBe("depart");
    expect(r.aChiffrer).toEqual([{ kind: "multiplier", id: "M05" }]);
  });

  it("multilingue → à chiffrer, la formule ne change pas", () => {
    const r = formule(recommanderFormule(selection({ languageMode: "multilingual" })));
    expect(r.formule).toBe("depart");
    expect(r.aChiffrer).toEqual([{ kind: "langue" }]);
  });

  it("bilingue et Loi 25 sont compris : aucun effet", () => {
    const r = formule(
      recommanderFormule(selection({ languageMode: "bilingual", multipliers: ["M08"] }))
    );
    expect(r.formule).toBe("depart");
    expect(r.aChiffrer).toEqual([]);
  });

  it("la plus haute exigence l'emporte et chaque raison n'apparaît qu'une fois", () => {
    const r = formule(
      recommanderFormule(
        selection({
          sector: "MED",
          siteType: "S02",
          multipliers: ["M12", "M04"],
          sectorModules: ["MED01"],
        })
      )
    );
    expect(r.formule).toBe("croissance");
    expect(raisonsNonCouvertes(r, "depart")).toEqual([
      "plusDe5Pages",
      "animations",
      "priseDeRendezVous",
    ]);
    expect(raisonsNonCouvertes(r, "pro")).toEqual(["priseDeRendezVous"]);
    expect(r.aChiffrer).toEqual([{ kind: "multiplier", id: "M04" }]);
  });
});

describe("table des options", () => {
  it("classe chaque option sélectionnable de l'assistant", () => {
    const ids = [
      ...ADDITIVE_IDS,
      ...Object.values(SECTOR_MODULES).flat().map((m) => m.id),
    ];
    const nonClassees = ids.filter((id) => !(id in EFFET_OPTIONS));
    expect(nonClassees).toEqual([]);
  });

  it("a un texte FR et EN pour chaque raison et chaque formule", () => {
    const raisons = new Set<RaisonId>();
    for (const effet of Object.values(EFFET_OPTIONS)) {
      if (effet?.effet === "monte") raisons.add(effet.raison);
    }
    raisons.add("plusDe5Pages");
    for (const catalog of [fr, en]) {
      for (const r of raisons) expect(catalog.formules.raisons[r]).toBeTruthy();
      for (const f of FORMULES) expect(catalog.formules[f.id].inclus.length).toBeGreaterThan(3);
    }
  });

  it("n'affiche aucun prix interdit dans les textes", () => {
    for (const catalog of [fr, en]) {
      const texte = JSON.stringify(catalog);
      expect(texte).not.toMatch(/24 mois|24-month|199|taux horaire|hourly|grille tarifaire|pricing grid/i);
    }
  });
});
