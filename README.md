# Atelier IA de Tableaux — V3 Vercel sécurisée

Application React/Vite qui génère des tableaux IA avec Pollinations.ai et le modèle `zimage`.

## Ce qui change en V3

Cette version ne demande plus la clé API dans l'interface.

Le frontend appelle :

```text
/api/generate
```

La fonction serveur Vercel appelle ensuite Pollinations avec la variable d'environnement :

```text
POLLINATIONS_API_KEY
```

Ainsi, la clé API n'est pas visible côté navigateur.

## Liens

- Repository : https://github.com/Stephcom75/atelier-ia-tableaux
- Vercel : https://atelier-ia-tableaux.vercel.app
- Pollinations : https://pollinations.ai
- Compte API Pollinations : https://enter.pollinations.ai

## Variables d'environnement Vercel

Dans Vercel :

```text
Project → Settings → Environment Variables
Name  : POLLINATIONS_API_KEY
Value : votre clé API Pollinations
```

Appliquer à :

```text
Production
Preview
Development
```

## Installation locale

Pour tester localement :

```bash
npm install
npm run dev
```

Attention : en local, la route `/api/generate` fonctionne surtout via Vercel.  
Pour tester le backend localement, utilisez plutôt :

```bash
npx vercel dev
```

## Déploiement

Vercel est connecté au repository GitHub.  
À chaque push sur la branche `main`, Vercel redéploie automatiquement.

```bash
git add .
git commit -m "V3 secure Vercel backend"
git push
```

## Crédit Pollinations

- Badge visible : `Built with pollinations.ai`
- Lien vers `pollinations.ai`
- Lien vers `enter.pollinations.ai`
- App Author : `Stephcom75`
