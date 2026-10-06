BOS — LIGHT V1.2

Application PWA autonome regroupant :
- LIGHT — Projecteurs et Lux
- EXPO — Dynamique de l’image

GitHub Pages : déposer LE CONTENU de ce dossier à la racine du dépôt.
index.html doit être directement à la racine.

Architecture :
- une seule PWA / un seul manifest / un seul service worker ;
- LIGHT et EXPO restent séparés en interne mais forment une seule interface continue ;
- état commun LIGHT ↔ EXPO pour le thème et les réglages utiles ;
- bases communes BOS avec fallback local.

Sources :
- LIGHT : module V79 (LIGHT V0.62)
- EXPO : BOS_EXPO_V3_65_CAMERA_DB_V1_7

V1.1 — INTERFACE CONTINUE
- LIGHT et EXPO ne sont plus présentés comme deux applications / deux entrées.
- Une seule PWA LIGHT avec un seul header et un seul CTA professionnel.
- Toutes les cartes LIGHT puis EXPO s’enchaînent verticalement sur la même page.
- Les headers, retours et footers internes des modules sont masqués dans ce mode continu.

V1.2 — RÉGLAGES CAMÉRA COMMUNS
- Les deux zones « Réglages caméra » sont remplacées visuellement par une seule bulle 01 tout en haut.
- Cette bulle regroupe : Marque, Caméra, Gamma, ISO max accepté, Ouverture et Vitesse.
- Les réglages restent reliés aux moteurs LIGHT et EXPO existants.
- TIPS et RESET sont regroupés côte à côte en haut de l’application.
- Numérotation continue : 01 Réglages caméra, 02 Key Light, 03 Fill Light, 04 Gélatines, 05 Explorer la dynamique de l’image, 06 Références caméra, 07 Compenser.
- La bulle Références caméra est placée avant Compenser afin de conserver cette séquence.
