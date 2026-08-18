# BOS-PROJECTEURS-DB — intégration LIGHT

Source centrale :
`https://raw.githubusercontent.com/BrunoOnSet/BOS-PROJECTEURS-DB/main/lights.json`

LIGHT ne maintient plus de liste indépendante de projecteurs.

- `capabilities.lightCalculator` : disponible dans BOS LIGHT
- `capabilities.planFeu` : disponible dans BOS Plan Feu
- `calculator.accessories` : photométries par accessoire/modificateur
- `quality: measured` : mesure constructeur
- `quality: estimated` : estimation explicitement signalée

`lights.json` présent dans ce dossier est uniquement une copie locale de secours de la base centrale.
Pour une mise à jour du catalogue, modifier **BOS-PROJECTEURS-DB**, puis remplacer éventuellement cette copie de secours par le même fichier.
