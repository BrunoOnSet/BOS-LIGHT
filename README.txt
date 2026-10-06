BOS — LIGHT V1.0

Application PWA autonome regroupant :
- LIGHT — Projecteurs et Lux
- EXPO — Dynamique de l’image

GitHub Pages : déposer LE CONTENU de ce dossier à la racine du dépôt.
index.html doit être directement à la racine.

Architecture :
- une seule PWA / un seul manifest / un seul service worker ;
- LIGHT et EXPO sont des routes internes sous modules/ ;
- état commun LIGHT ↔ EXPO pour le thème et les réglages caméra principaux ;
- bases communes BOS avec fallback local.

Sources :
- LIGHT : module V79 (LIGHT V0.62)
- EXPO : BOS_EXPO_V3_65_CAMERA_DB_V1_7
