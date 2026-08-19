BOS LIGHT — V0.20
=================

Nouveauté principale
--------------------
LIGHT utilise désormais BOS-PROJECTEURS-DB comme source de référence commune :
https://raw.githubusercontent.com/BrunoOnSet/BOS-PROJECTEURS-DB/main/lights.json

Principe
--------
- Aucun catalogue projecteur indépendant n'est maintenu dans app.js.
- LIGHT charge la base centrale et filtre automatiquement les fiches avec :
  capabilities.lightCalculator = true
- La même base peut être utilisée par Plan Feu avec :
  capabilities.planFeu = true
- La copie locale lights.json est uniquement un secours si GitHub est indisponible.
  Elle doit rester une copie de BOS-PROJECTEURS-DB, pas une base parallèle.

Ordre de chargement
-------------------
1. BOS-PROJECTEURS-DB sur GitHub (source principale)
2. lights.json local (fallback de secours)

Le fonctionnement, les calculs et le design de LIGHT V0.15 sont conservés.


V0.17 — Ajout optionnel d’une Fill Light avec mêmes réglages que la Key, mémorisation, écart Key/Fill en stops, ratio des sources et contraste d’éclairage théorique (Key+Fill)/Fill.

V0.20 — Détails techniques
--------------------------
- Key Light et Fill Light : bouton « Détails techniques constructeur » placé tout en bas du panneau.
- Ces bulles n'affichent que la configuration photométrique de référence et les points constructeur utilisés.
- Résultat Key Light : bouton « Détails techniques » séparé avec lux au sujet, marge, ISO équivalent, ouverture possible et statut interpolation/extrapolation.
- Suppression dans le résultat des mesures constructeur, de la note « Puissance 100 % » et du statut BOS-PROJECTEURS-DB.
