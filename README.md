# Atelier IA de Tableaux

Application React/Vite générant des tableaux IA avec Pollinations.ai et le modèle `zimage`.

## Liens du projet

- Application GitHub Pages : https://Stephcom75.github.io/atelier-ia-tableaux/
- Repository GitHub : https://github.com/Stephcom75/atelier-ia-tableaux
- Pollinations : https://pollinations.ai
- Compte / API Pollinations : https://enter.pollinations.ai

## Crédit Pollinations

Cette application respecte les exigences de crédit :

- Lien vers `pollinations.ai`
- Badge visible : `Built with pollinations.ai`
- App Author : `Stephcom75`
- Utilisation de l’API Pollinations
- Modèle image : `zimage`

## Sécurité API

Ne jamais publier une clé secrète `sk_` dans le code frontend.

Pour cette version GitHub Pages, l’utilisateur entre sa clé `pk_` dans l’interface.  
Elle est conservée seulement dans le navigateur via `localStorage`.

Pour une app commerciale, il faudra créer une version backend proxy sécurisée.

## Installation locale

```bash
npm install
npm run dev
```

## Mise en ligne GitHub Pages

Après avoir envoyé les fichiers sur GitHub :

1. Va dans ton dépôt GitHub : https://github.com/Stephcom75/atelier-ia-tableaux
2. Va dans `Settings`
3. Va dans `Pages`
4. Dans `Build and deployment`, choisis `GitHub Actions`
5. Pousse le code sur la branche `main`
6. Le site sera disponible ici : https://Stephcom75.github.io/atelier-ia-tableaux/

## Commandes Git pour envoyer le projet

Depuis le dossier du projet :

```bash
git init
git add .
git commit -m "Initial commit - Atelier IA de Tableaux"
git branch -M main
git remote add origin https://github.com/Stephcom75/atelier-ia-tableaux.git
git push -u origin main
```
