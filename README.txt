BOS LIGHT — V0.2

NOUVEAUTÉS V0.2
- Suppression du slider de taille de source.
- Choix de projecteur : amaran Halo 60x, 100x, 200x, 300x, 600x.
- Choix d'accessoire : Nu, Réflecteur, Softbox 60 ou 90 selon le projecteur.
- Intensité projecteur : 0 à 100 %.
- Réglages caméra : ISO, shutter, diaphragme.
- Affichage de l'éclairement estimé au sujet en lux.
- Affichage d'un écart d'exposition en stops basé sur une mesure incidente.
- Le mode AUTO a été supprimé : l'exposition est maintenant déterminée par la lumière + les réglages caméra.

PHOTOMÉTRIE
Les valeurs à 5600 K proviennent des tableaux de mesures laboratoire Aputure/amaran publiés pour la gamme Halo.

Halo 60x / 100x : mesures officielles à 1 m et 3 m pour :
- No Accessories
- Mini Reflector
- Light Dome 60

Halo 200x / 300x / 600x : mesures officielles à 1 m, 3 m et 5 m pour :
- No Accessories
- Reflector
- Light Dome 90

Entre les distances mesurées, BOS Light interpole en espace log/log pour conserver une courbe de type loi de puissance qui passe exactement par les données constructeur.
Sous 1 m et au-delà du dernier point mesuré, BOS Light extrapole en inverse-square.

INTENSITÉ 0–100 %
Les appareils proposent un réglage d'intensité de 0 à 100 %, mais la documentation constructeur consultée ne publie pas une courbe lux par lux selon la position du dimmer.
Cette V0.2 suppose donc une relation linéaire entre le pourcentage d'intensité et l'éclairement. C'est une approximation explicite.

CAMÉRA / EXPOSITION
Le calcul d'écart d'exposition utilise la relation d'un posemètre incident :
N² / t = E × ISO / C
avec C = 250.

Le rendu applique ensuite les variations relatives ISO / shutter / diaphragme. L'objectif est d'obtenir une cohérence en stops, pas de certifier une mesure d'exposition absolue pour n'importe quelle peau ou chaîne colorimétrique.

DOUCEUR DES OMBRES
Le choix d'accessoire agit aussi sur la douceur :
- Nu : petite source, ombres dures.
- Réflecteur : source dure et concentrée.
- Softbox 60/90 : surface apparente plus grande, ombres plus douces.

La douceur reste une approximation temps réel via PCFSoftShadowMap + shadow.radius. Ce n'est pas encore un rendu path-tracé d'une vraie surface émissive.

IMPORTANT
Ce prototype charge Three.js et le scan Lee Perry-Smith depuis Internet.
Pour le tester correctement, déploie le dossier sur GitHub Pages / Netlify / Vercel,
ou lance un serveur local puis ouvre la page avec une connexion Internet.

Exemple de serveur local :
  python3 -m http.server 8080
Puis ouvrir : http://localhost:8080

Licence du modèle humain
"Infinite, 3D Head Scan" by Lee Perry-Smith
Creative Commons Attribution 3.0 Unported (CC BY 3.0)
Source / copie utilisée : examples/models/gltf/LeePerrySmith du dépôt three.js.

Ce modèle est utilisé ici uniquement comme base de prototype technique.
Pour une version publique/finale BOS Light, il est conseillé de choisir un scan humain
avec licence commerciale et esthétique validées pour le produit final.
