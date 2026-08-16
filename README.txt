BOS LIGHT — V0.11
=================

Nouveautés
----------
- Ajout de Nanlite et Godox au catalogue multi-marques.
- Nanlite : FC (FC-60B, FC-120B, FC-720B) et FORZA (Forza 60B II, Forza 150B).
- Godox : SL (SL60IIBi), ML (ML80Bi, ML150Bi) et LITEMONS (LA600Bi).
- Softbox estimées ajoutées quand le constructeur ne publie pas de photométrie directe pour ce modificateur.
- Les valeurs mesurées et les estimations restent clairement distinguées dans Détails techniques.
- Structure conservée : 01 Caméra / 02 Ma lumière / 03 Réglages lumière / 04 Résultat / Détails techniques.

Données Nanlite / Godox
-----------------------
Pour cette première intégration, LIGHT n'utilise que les photométries que nous avons pu rattacher clairement à une configuration constructeur.
Quand un seul point (souvent 1 m) est publié, LIGHT le signale et extrapole la distance selon le carré inverse : le résultat est alors une estimation.

Les softbox marquées ≈ ne sont PAS des mesures constructeur. Elles utilisent le même moteur d'estimation que les autres marques, à partir d'une sortie mesurée du projecteur.

Important
---------
- Sous 100 % de dimmer, LIGHT estime la baisse de lux proportionnellement au pourcentage, faute de courbe de gradation détaillée pour chaque modèle.
- Le calcul d'exposition incidente utilise C = 340 (logique Lumisphere Sekonic).
- LIGHT reste une aide de préparation/tournage : une mesure réelle au posemètre reste la référence quand l'exposition est critique.

Historique récent
-----------------
V0.10 : ajout des softbox estimées et du marquage ≈ / ESTIMATION.
V0.11 : ajout initial de Nanlite et Godox.
