#!/bin/sh

# Função de ajuda
function usage() {
  echo -e "Uso: replace_secrets [-h] [-a] [-f <format>] <arquivo modelo> [<arquivo com valores>]\n\n\
Atualiza um arquivo modelo com os valores de segredos.\n\n\
O arquivo com os valores por padrão é do tipo environment (linhas com nome=valor).\n\
Para usar o formato separado por tabulações (nome<TAB>valor) use a opção \"-f tab\"\n\
Para ler os valores da entrada STDIN passe o valor \"-\" como argumento.\n\n\
Se não for fornecido o argumento do arquivo com valores, as variávies de ambiente serão utilizadas.\n\n\
Por padrão, somente os nomes que começam com \"SECRET_\" serão considerados.\n\
Caso a opção \"-a\" seja passada, todos os nomes serão considerados."
  exit 1
}

# Função de tratamento de erros
function error() {
  echo "Um erro aconteceu"
  exit 1
}
trap error ERR

# Verifica se temos o sed instalado
if [ -z $(command -v sed) ]; then
  echo "O programa 'sed' é necessário para usar este script. Instale-o antes."
  exit 1
fi

# Função que substitui "nome" por "valor" em "arquivo"
# Argumentos: nome, valor, arquivo
replace_value() {
  local ESCAPED_VALUE=$(printf '%s\n' "$2" | sed -e 's/[\\\/&]/\\&/g')
  sed -i "s/$1/${ESCAPED_VALUE}/g" "$3"
}

# Função que processa o stream de dados nome=valor e substitui em "arquivo"
# Argumentos: arquivo
# Fornecer os dados via STDIN
process_data() {
  if [ "$FORMAT" = "env" ]; then
    local DELIM='='
  elif [ "$FORMAT" = "tab" ]; then
    local DELIM='	'
  fi
  while IFS=$DELIM read -r name value; do
    if [ $PREFIX -eq 1 ]; then
      case "$name" in
        SECRET_*) ;;
        *) continue ;;
      esac
    fi

    replace_value "$name" "$value" "$1"
  done
}

FORMAT="env"
PREFIX=1

# Processa opções
while getopts ':haf:' optname; do
  case ${optname} in
    h) usage;;
    a) PREFIX=0;;
    f) FORMAT=${OPTARG};;
    :) echo "Faltando valor para opção ${OPTARG}"; usage;;
    ?) echo "Opção inválida: ${OPTARG}";;
  esac
done
shift $((OPTIND -1))

# Verifica os argumentos além das opções
if [ $# -lt 1 ]; then
  echo "Faltando argumentos."
  usage
fi

# Processa argumentos para ver de onde carregar os valores
if [ $# -eq 1 ]; then
  # Lê os valores das variávies de ambiente
  FORMAT="env"
  env | process_data "$1"
else
  if [ "$2" = "-" ]; then
    # Lê os valores de STDIN
    cat | process_data "$1"
  else
    # Lê valores do arquivo passado como argumento
    process_data "$1" < "$2"
  fi
fi