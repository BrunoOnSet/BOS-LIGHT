BOS LIGHT — Prototype V0
========================

But du prototype
- Valider une Key Light interactive sur un visage 3D.
- 4 placements : Paramount, Loop, Rembrandt, Split.
- Taille source, distance source, distance caméra.
- Expo Auto / Physique.
- Vue Preview + vue Setup.

IMPORTANT
Ce prototype charge Three.js et le scan Lee Perry-Smith depuis Internet.
Pour le tester correctement, déploie le dossier sur GitHub Pages / Netlify / Vercel,
ou lance un serveur local puis ouvre la page avec une connexion Internet.

Exemple de serveur local :
  python3 -m http.server 8080
Puis ouvrir : http://localhost:8080

Précision physique
La distance/intensité utilise un comportement inverse-square (decay=2).
Le mode AUTO compense l'intensité proportionnellement au carré de la distance.
La douceur des ombres est une approximation temps réel par PCFSoftShadowMap + shadow.radius.
Ce n'est PAS encore un rendu path-tracé d'une vraie surface émissive.

Licence du modèle humain
"Infinite, 3D Head Scan" by Lee Perry-Smith
Creative Commons Attribution 3.0 Unported (CC BY 3.0)
Source / copie utilisée : examples/models/gltf/LeePerrySmith du dépôt three.js.

Ce modèle est utilisé ici uniquement comme base de prototype technique.
Pour une version publique/finale BOS Light, il est conseillé de choisir un scan humain
avec licence commerciale et esthétique validées pour le produit final.
