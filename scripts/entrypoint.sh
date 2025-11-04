#!/bin/sh

# Copia .env.production para .env
if [ -f ".env.production.secrets" ]; then
    cp .env.production.secrets .env
    echo "Copiado .env.production.secrets para .env"
fi

# Executa aws_secrets_patch.sh se existir
if [ -f "scripts/aws_secrets_patch.sh" ] && [ -n "$secret_app_p_cop30_arn" ] && [ -f ".env" ]; then
    ./scripts/aws_secrets_patch.sh ${secret_app_p_cop30_arn} .env
    echo "Executado aws_secrets_patch.sh"
fi

# Executa o comando original
exec "$@"