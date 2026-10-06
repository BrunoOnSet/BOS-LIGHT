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

V1.1 — INTERFACE CONTINUE
- LIGHT et EXPO ne sont plus présentés comme deux applications / deux entrées.
- Une seule PWA LIGHT avec un seul header et un seul CTA professionnel.
- Toutes les cartes LIGHT puis EXPO s’enchaînent verticalement sur la même page.
- Les headers, retours et footers internes des modules sont masqués dans ce mode continu.
- Les modules conservent leur code métier séparé en interne pour faciliter la maintenance, mais cette séparation n’est plus visible par l’utilisateur.
