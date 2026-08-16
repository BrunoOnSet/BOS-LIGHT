BOS LIGHT — V0.5
================

Objectif
--------
LIGHT est désormais pensé comme une aide simple de préparation et de tournage :
"Est-ce que ma lumière va suffire avec mes réglages ?"

Écran principal
---------------
- Distance maximale immédiatement lisible
- Curseur "Ma lumière est à"
- Statut simple : CONFORTABLE / ÇA PASSE / TROP LOIN
- Suggestions concrètes : rapprocher, dimmer, ouvrir, monter l'ISO ou choisir un projecteur plus puissant

Réglages principaux
-------------------
- Halo 60x / 100x / 200x / 300x / 600x
- Nu / Réflecteur / Softbox 60 ou 90 selon le projecteur
- Puissance 0–100 %
- ISO max accepté
- Ouverture
- Vitesse

Détails techniques
------------------
Les lux, marges en stops, température de couleur et points de mesure constructeur sont cachés dans "Détails techniques" afin de garder l'écran principal lisible pour un débutant.

Données photométriques
----------------------
Sources constructeur officielles :
https://help.amarancreators.com/en/amaran-halo-60x-100x/specifications
https://help.amarancreators.com/en/amaran-halo-200x-300x-600x/specifications

Les valeurs à 100 % passent par les points de mesure Aputure Lab. Entre les points, l'app interpole en échelle logarithmique. En dehors de la plage mesurée, elle extrapole et le signale dans les détails techniques.

Dimmer
------
Sous 100 %, l'app estime pour l'instant les lux proportionnellement au pourcentage de dimmer. Cette partie est explicitement indiquée comme moins fiable.

Exposition incidente
--------------------
Relation utilisée : E = C × N² / (ISO × t), avec C = 340, correspondant à la constante Lumisphere indiquée par Sekonic.
La V0.3 utilisait C = 250 (Lumidisc) : ce point est corrigé dans la V0.5.

Cache navigateur
----------------
Les fichiers CSS et JS sont appelés avec ?v=0.4 afin d'éviter qu'un ancien fichier reste affiché après remplacement sur GitHub Pages.


V0.5 : interface clarifiée pour débutants, explication de la référence d’exposition, solutions reformulées et distance de test minimale 1 m.
