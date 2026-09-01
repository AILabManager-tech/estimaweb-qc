#!/usr/bin/env python3
"""Génère le catalogue imprimable depuis les données du catalogue.

Source de vérité : audit-2026-09-01/data/catalogue.json (49 lignes, 94 niveaux)
Corrections appliquées : les cinq de l'audit marché du 2026-09-01, voir
formation/NIVEAUX_PAR_OPTION.md.

Usage : python3 tooling/generer_catalogue.py > formation/CATALOGUE.md
"""
import json, sys, pathlib

TAUX, MARGE = 125, 0.15
EFFECTIF = TAUX * (1 + MARGE)
ROOT = pathlib.Path(__file__).resolve().parent.parent
cat = json.load(open(ROOT / "audit-2026-09-01/data/catalogue.json", encoding="utf-8"))

# Correction 3 : forfaits, hors du modèle horaire.
FORFAIT = {"S10", "S11", "S12"}
# Correction 2 : pourcentage du sous-total, jamais d'heures fixes.
POURCENT = {"M13": ["+30 % du sous-total", "+50 % du sous-total"]}
HORS_HORAIRE = FORFAIT | set(POURCENT)

GROUPES = [
    ("Socles — type de site",        lambda i: i.startswith("S") and i[1:].isdigit() and int(i[1:]) <= 6),
    ("Compléments de socle",         lambda i: i in {"S07", "S08", "S09"}),
    ("Fonctionnalités et suppléments", lambda i: i.startswith("M") and i[1:].isdigit()),
    ("Modules juridiques",           lambda i: i.startswith("JUR")),
    ("Modules médicaux",             lambda i: i.startswith("MED")),
    ("Modules professionnels",       lambda i: i.startswith("PRO")),
    ("Modules PME",                  lambda i: i.startswith("PME")),
    ("Forfaits — hors du modèle horaire", lambda i: i in FORFAIT),
]

def eur(n):  return f"{n:,.0f} $".replace(",", " ")
def poids(p): return "●●●" if p == 3 else ("●●" if p == 2 else "●")
def retenu(l):
    for n in l["niveaux"]:
        if n.get("conseille"):
            return n
    return l["niveaux"][0]

out = []
w = out.append

w("# Catalogue des niveaux — EstimaWeb")
w("")
w(f"**49 lignes · 94 niveaux · {len(cat)-len(HORS_HORAIRE)} lignes au modèle horaire.**")
w("Révision du 1er septembre 2026, après l'audit marché. Les cinq corrections de méthode de")
w("l'audit sont appliquées.")
w("")
w("## Le taux")
w("")
w("| | |")
w("|---|---|")
w(f"| Taux de référence | {TAUX},00 $/h |")
w(f"| Marge d'imprévus | {MARGE*100:.0f} % |")
w("| **Taux effectif facturé** | **" + f"{EFFECTIF:.2f}".replace(".", ",") + " $/h** |")
w("")
w("Le taux ne varie jamais : seules les heures changent. Le mensuel se chiffre à part.")
w("")
w("## Comment lire")
w("")
w("**●●●** pèse lourd sur le prix · **●●** moyen · **●** peu. Sous chaque ligne, le moteur de")
w("coût dominant. La ligne « ↳ » dit ce que le niveau **ne fait pas** : c'est elle qui justifie")
w("de monter d'un cran. La colonne heures affiche le cumul — le niveau 2 contient le niveau 1.")
w("")
w("Les heures sont des **estimations, pas des mesures**. Sur les 94 niveaux, 10 seulement sont")
w("adossés à une preuve marché forte ou moyenne. Barre ce qui est faux et écris ta valeur.")
w("")
w("## Les lignes ne s'additionnent pas toutes")
w("")
w("Quinze règles retirent une ligne générique quand une ligne plus spécifique la couvre déjà.")
w("Un devis monté à la main en additionnant les lignes **surfacture jusqu'à 22 %**. Le détail")
w("des sept remplacements et des huit inclusions est dans `NIVEAUX_PAR_OPTION.md`.")
w("")

# ── Sommaire ──
w("## Sommaire — chaque ligne à son niveau conseillé")
w("")
w("| Q | Ligne | | Niveau conseillé | h | Prix | Corrigé |")
w("|---|---|---|---|---:|---:|---|")
h_tot = 0
for l in cat:
    if l["id"] in HORS_HORAIRE:
        continue
    n = retenu(l); h_tot += n["h_cumul"]
    w(f"| {l['q']} | `{l['id']}` | {l['nom']} | {n['nom'].split('. ',1)[-1]} | "
      f"{n['h_cumul']} | {eur(n['prix'])} | |")
w(f"| | | **Total des {len(cat)-len(HORS_HORAIRE)} lignes horaires** | | **{h_tot}** | "
  f"**{eur(h_tot*TAUX)}** | |")
w("")
w("Ce total est un **repère de volume, pas un prix** : aucun projet ne prend toutes les lignes.")
w("Il ne sert pas de contrôle — un contrôle qui compare une estimation à une autre issue de la")
w("même grille ne prouve rien.")
w("")
w("### Hors du modèle horaire")
w("")
w("| Ligne | | Traitement |")
w("|---|---|---|")
w("| `M13` | Délai comprimé | **+30 %** (quatre semaines) ou **+50 %** (deux semaines) du sous-total |")
for i in ("S10", "S11", "S12"):
    l = next(x for x in cat if x["id"] == i)
    w(f"| `{i}` | {l['nom']} | **Forfait** — prix à réviser, l'audit le situe trop bas d'un facteur 1,5 à 3 |")
w("")

# ── Détail ──
for titre, pred in GROUPES:
    lignes = [l for l in cat if pred(l["id"])
              and not (titre != "Forfaits — hors du modèle horaire" and l["id"] in FORFAIT)]
    if not lignes:
        continue
    w("---")
    w("")
    w(f"## {titre}")
    w("")
    for l in lignes:
        w(f"### `{l['id']}` — {l['nom']}")
        w("")
        if l["id"] in POURCENT:
            w("*Se chiffre en pourcentage du sous-total, jamais en heures fixes.*")
        elif l["id"] in FORFAIT:
            w("*Vendu au forfait. Prix à réviser — l'audit le situe trop bas d'un facteur 1,5 à 3.*")
        else:
            n = retenu(l)
            w(f"*{poids(l['poids'])} · moteur : {l['moteur']} · conseillé : "
              f"{n['nom'].split('. ',1)[-1]}, {n['h_cumul']} h, {eur(n['prix'])}*")
        w("")
        for i, n in enumerate(l["niveaux"], 1):
            if l["id"] in POURCENT:
                suffixe = f" — *{POURCENT[l['id']][i-1]}*"
            elif l["id"] in FORFAIT:
                suffixe = f" — *forfait, {eur(n['prix'])} à réviser*"
            else:
                suffixe = f" — *{n['h_cumul']} h · {eur(n['prix'])}*"
            marque = " ★" if n.get("conseille") else ""
            w(f"**{i}. {n['nom'].split('. ',1)[-1]}**{marque}{suffixe}  ")
            w(n["inclus"])
            if n.get("limite"):
                w("")
                w(f"↳ *{n['limite']}*")
            w("")
w("---")
w("")
w("*★ = niveau conseillé. Généré par `tooling/generer_catalogue.py` depuis les données du")
w("catalogue. Ne pas éditer à la main : corriger la source et régénérer.*")

sys.stdout.write("\n".join(out) + "\n")
