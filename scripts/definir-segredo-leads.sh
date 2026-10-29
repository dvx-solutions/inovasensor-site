#!/bin/sh
# Gera o segredo do GET /api/leads e grava a MESMA cópia em dois lugares, sem
# nunca mostrar na tela:
#   1. segredo SITE_LEADS_TOKEN do GitHub (o workflow de preview passa para a Vercel);
#   2. ~/guarda-meta/dados/site-leads-token no eveo-dev (chmod 600), lido pelo agente CMO.
# Rodar de novo troca o segredo nos dois lugares (depois, reabra o PR ou rode o
# preview de novo para a Vercel receber o novo valor).
set -eu
REPO=dvx-solutions/inovasensor-site
SERVIDOR=${SERVIDOR:-eveo-dev}

segredo=$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64url'))")

printf %s "$segredo" | gh secret set SITE_LEADS_TOKEN --repo "$REPO"
printf %s "$segredo" | ssh "$SERVIDOR" 'umask 077; mkdir -p ~/guarda-meta/dados; cat > ~/guarda-meta/dados/site-leads-token; chmod 600 ~/guarda-meta/dados/site-leads-token'
segredo=

echo "Segredo gravado no GitHub ($REPO) e em $SERVIDOR:~/guarda-meta/dados/site-leads-token."
