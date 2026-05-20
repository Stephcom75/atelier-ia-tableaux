# Atelier IA de Tableaux — V3.1 Vercel sécurisée

Application React/Vite qui génère des tableaux IA avec Pollinations.ai et le modèle `zimage`.

## Correction V3.1

La V3 générait bien l'image, mais l'URL renvoyée par Pollinations demandait encore une authentification.
Résultat : la carte apparaissait dans la galerie, mais l'image ne s'affichait pas.

La V3.1 corrige cela :

1. Le frontend appelle `/api/generate`
2. La fonction serveur Vercel appelle Pollinations avec `POLLINATIONS_API_KEY`
3. La fonction serveur récupère l'image avec l'autorisation serveur
4. Elle renvoie au frontend une image intégrée en `data:image/...;base64`
5. L'utilisateur ne voit jamais la clé API

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

## Déploiement

```bash
git add .
git commit -m "Fix image display with server-side image proxy"
git push
```

Vercel redéploie automatiquement après le push.

## Crédit Pollinations

- Badge visible : `Built with pollinations.ai`
- Lien vers `pollinations.ai`
- Lien vers `enter.pollinations.ai`
- App Author : `Stephcom75`
