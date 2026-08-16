BOS LIGHT — V0.9
================

Nouveautés
----------
- Catalogue multi-marques : amaran + Aputure.
- amaran : HALO, RAY, COB S et ACE (Ace 25x / Ace 25c).
- Aputure : LIGHT STORM et STORM.
- LIGHT STORM intégrés : LS 60x, LS 300x, LS 300d II, LS 600d Pro, LS 600x Pro, LS 600c Pro II, LS 1200d Pro.
- STORM intégrés : 80c, 400x, 700x, 1000c, 1200x.
- Structure conservée : 01 Caméra / 02 Ma lumière / 03 Réglages lumière / 04 Résultat / Détails techniques.
- 02 Ma lumière est repliable et tous les réglages sont conservés en localStorage, même après fermeture/rafraîchissement.
- Distance source/sujet : 1 à 20 m.

ACE
---
Les Ace 25x et 25c utilisent à 100 % les mesures officielles du Boost Mode. Accessoires disponibles dans LIGHT : Nu, Dome Diffuser, Light Control Grid.

Aputure
-------
Les accessoires affichés dépendent du modèle et uniquement des photométries constructeur intégrées dans cette version. Certains modèles ont volontairement moins de modificateurs que leur catalogue réel : on n'affiche pas une combinaison si nous n'avons pas intégré une table photométrique fiable.

Important
---------
Sous 100 % de dimmer, LIGHT estime toujours la baisse de lux proportionnellement au pourcentage, faute de courbe de gradation détaillée pour chaque modèle.
Le calcul d'exposition incidente utilise C = 340 (logique Lumisphere Sekonic).
Le résultat reste une aide de préparation/tournage et ne remplace pas une mesure au posemètre lorsque l'exposition est critique.


V0.10 : ajout de softbox estimées sur COB S, RAY, Aputure Light Storm et STORM. Les estimations sont explicitement marquées ≈ et ESTIMATION. Ajout Parapluie / diffuseur estimé sur ACE.
