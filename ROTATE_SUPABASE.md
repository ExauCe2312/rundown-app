# Rotation Supabase — Checklist rapide

Ce document décrit les étapes sûres et minimales pour rotater la clé publishable (anon) et mettre à jour Vercel + local.

IMPORTANT: Ne partage jamais les clés dans ce chat. Exécute les commandes localement.

## 1) Régénérer la clé (Supabase UI)
- Ouvrir Supabase → Settings → API → Publishable and secret API keys
- Cliquer sur `New publishable key` ou `Regenerate` à côté de la clé `default` (publishable)
- Copier la nouvelle clé (clipboard)

## 2) Mettre à jour Vercel (Dashboard — recommandé)
- Ouvrir Vercel → ton projet → Settings → Environment Variables
- Modifier `VITE_SUPABASE_ANON_KEY` pour chaque environnement utilisé (Production / Preview / Development) : coller la nouvelle clé
- Sauvegarder et déclencher un redeploy via l'onglet Deployments → Redeploy

### Option CLI (Vercel)
> Exécuter localement (tu seras invité à coller la valeur)

```
vercel env rm VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_ANON_KEY preview
vercel env add VITE_SUPABASE_ANON_KEY development
vercel --prod
```

## 3) Mettre à jour localement
- Ouvrir `./.env.local` et remplacer `VITE_SUPABASE_ANON_KEY` par la nouvelle clé.
- Si tu ne veux pas de fichier local, supprime `./.env.local` et utilise uniquement les variables Vercel.
- Redémarrer le serveur dev :

```
npm run dev
```

## 4) Vérifications post-rotation
- Supabase: ouvrir `Project → Logs` et vérifier les accès récents pour comportements suspects.
- Supabase: activer Row-Level Security (RLS) sur les tables publiques et vérifier les policies.
- S’assurer que `service_role` (`sb_secret_...`) n’est stockée que côté serveur (ex. Vercel secrets) et jamais dans le repo.

## 5) Nettoyage local et sécurité
- Confirmer que `.env.local` est listé dans `.gitignore` (déjà fait).
- Si tu veux, supprime le fichier local après rotation :

```
rm .env.local
```

## 6) En cas de doute
- Si la clé a été publique longtemps, considère révoquer complètement l’ancienne clé et surveiller la facturation/usage.

---
Fait pour toi : vérifie ces étapes dans l'UI Supabase et Vercel. Si tu veux, je peux :
- te guider en direct pendant que tu colles la nouvelle clé (tu gardes la clé privée), ou
- exécuter les commandes `vercel env` ici si tu as configuré le CLI et que tu veux que je tente un `vercel env ls` (je ne recevrai pas la clé via le chat).
