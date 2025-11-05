#!/bin/sh

usage() {
  echo -e "Uso: aws_secrets_pacth.sh [-h] [-n] [-s <nome do arquivo>] <secret ID> <arquivo 1> [<arquivo 2> ... ]\n\n\
Carrega os secrets da AWS identificados pelo ID passado e faz a substituição dos valores nos arquivos passados como argumento.\n\
A opção \"-s\" faz com que os secrets sejam salvos no arquivo /tmp/<nome do arquivo>.\n\
A opção \"-n\" normaliza o nome dos secrets adicionando o prefixo \"SECRET_\" e deixando tudo em maíusculo."
  exit 1
}

# Verifica se temos os comandos aws e sed instalados
if [ -z $(command -v aws) ] | [ -z $(command -v sed) ]; then
  echo "Os programas 'aws' e 'sed' são necessários para usar este script. Instale-os antes."
  exit 1
fi

# Processa as opções
SAVE=0
SECRETS_PATH=""
NORMALIZE=0
while getopts ":hns:" optname; do
  case ${optname} in
    h) usage;;
    n) NORMALIZE=1;;
    s) SAVE=1; SECRETS_PATH="/tmp/${OPTARG}";;
    :) echo "Faltando parâmetro para opção ${OPTARG}"; usage;;
    ?) echo "Opção inválida: ${OPTARG}";;
  esac
done    
shift $((OPTIND -1))

# Verifica os argumentos
if [ $# -lt 1 ]; then
  echo "Erro: Faltando argumento secret ID"
  usage
fi

SECRET_ID="$1"
shift 1

# Carrega os secrets da AWS
DATA_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ID" --query SecretString --output text)

# Processa os screts, convertendo de JSON para formato chave=valor
# Primeiro retira as chaves do início e final. Pattern: ^\{ *| *\}
# Depois localiza um padrão do tipo "chave":"valor". Pattern: (^|[, ]+)"(([^"\\]|\\.)+)" *: *"(([^"\\]|\\.)+)" *
# Depois elimina os escaping da contrabarra e das aspas duplas dentro das strings JSON. Pattern: \\([\\"])
DATA=$(echo "$DATA_JSON" | sed -E 's/^\{ *| *\}$//g; s/(^|[, ]+)"(([^"\\]|\\.)+)" *: *"(([^"\\]|\\.)*)" */\2=\4\n/g; s/\\([\\"])/\1/g')

# Salva os secrets em arquivo, se foi solicitado
if [ $SAVE -eq 1 ]; then
  echo "Salvando secrets em ${SECRETS_PATH}"
  echo "$DATA" > "$SECRETS_PATH"
fi

# Se passada a opção, normaliza o nome dos secrets para iniciar com SECRET_
# e ficar tudo em maiúsculas
if [ $NORMALIZE -eq 1 ]; then
  DATA=$(echo "$DATA" | sed -E '/^SECRET_/b; s/^([^=]+)=/SECRET_\U\1=/')
fi

# Faz a substituição de valores nos arquivos indicados
for FILE in "$@"; do
  echo "Atualizando arquivo $FILE"
  echo "$DATA" | replace_secrets.sh $REPLACE_OPT "$FILE" -
done