#!/bin/bash
API=http://localhost:8000/api/v1

req() {
  local metodo=$1 url=$2 corpo=$3
  if [ -n "$corpo" ]; then
    curl -s -w "\nHTTP %{http_code}\n" -X "$metodo" "$url" \
      -H "Content-Type: application/json" -H "Accept: application/json" -d "$corpo"
  else
    curl -s -w "\nHTTP %{http_code}\n" -X "$metodo" "$url" -H "Accept: application/json"
  fi
  echo
}

echo "### Limpando a tabela para os ids começarem em 1"
docker compose exec -T db psql -U meu_app -d meu_app -c "TRUNCATE solicitacoes RESTART IDENTITY;"
echo

echo "### 1. Criar solicitação válida (esperado: 201, status RECEBIDA)"
resp=$(curl -s -X POST $API/solicitacoes -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"nome_solicitante":"Maria Teste","categoria":"CONSULTA","prioridade":"BAIXA","descricao":"Consulta de rotina"}')
echo "$resp"
ID=$(echo "$resp" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "-> id criado: $ID"
echo

echo "### 2. URGENTE sem justificativa (esperado: 422)"
req POST $API/solicitacoes '{"nome_solicitante":"Joao Teste","categoria":"EXAME","prioridade":"URGENTE","descricao":"Teste"}'

echo "### 3. URGENTE com justificativa (esperado: 201)"
req POST $API/solicitacoes '{"nome_solicitante":"Joao Teste","categoria":"EXAME","prioridade":"URGENTE","justificativa_prioridade":"Paciente com risco","descricao":"Exame urgente"}'

echo "### 4. Dados inválidos (esperado: 422 listando os campos)"
req POST $API/solicitacoes '{"categoria":"XYZ","prioridade":"ALTA"}'

echo "### 5. Listar (esperado: 200)"
req GET $API/solicitacoes

echo "### 6. Filtrar por prioridade URGENTE (esperado: 200, só a urgente)"
req GET "$API/solicitacoes?prioridade=URGENTE"

echo "### 7. Filtro inválido (esperado: 422)"
req GET "$API/solicitacoes?status=XYZ"

echo "### 8. Detalhar id $ID (esperado: 200)"
req GET $API/solicitacoes/$ID

echo "### 9. Id inexistente (esperado: 404)"
req GET $API/solicitacoes/999

echo "### 10. RECEBIDA -> AGENDADA (esperado: 422, transição proibida)"
req PATCH $API/solicitacoes/$ID/status '{"status":"AGENDADA"}'

echo "### 11. RECEBIDA -> EM_ANALISE (esperado: 200)"
req PATCH $API/solicitacoes/$ID/status '{"status":"EM_ANALISE"}'

echo "### 12. EM_ANALISE -> AGENDADA (esperado: 200)"
req PATCH $API/solicitacoes/$ID/status '{"status":"AGENDADA"}'

echo "### 13. AGENDADA -> CONCLUIDA (esperado: 200)"
req PATCH $API/solicitacoes/$ID/status '{"status":"CONCLUIDA"}'

echo "### 14. CONCLUIDA -> CANCELADA (esperado: 422, status final)"
req PATCH $API/solicitacoes/$ID/status '{"status":"CANCELADA"}'

echo "### 15. Status inexistente (esperado: 422)"
req PATCH $API/solicitacoes/$ID/status '{"status":"XYZ"}'
