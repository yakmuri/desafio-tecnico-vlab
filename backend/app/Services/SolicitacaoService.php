<?php

namespace App\Services;

use App\Enums\Prioridade;
use App\Enums\Status;
use App\Exceptions\TransicaoStatusInvalidaException;
use App\Models\Solicitacao;
use BackedEnum;
use Illuminate\Support\Facades\DB;

class SolicitacaoService
{
    public function alterarStatus(Solicitacao $solicitacao, Status $novoStatus): Solicitacao
    {
        return DB::transaction(function () use ($solicitacao, $novoStatus) {
            $atual = Solicitacao::whereKey($solicitacao->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            if (! $atual->status->podeIrPara($novoStatus)) {
                throw new TransicaoStatusInvalidaException($atual->status, $novoStatus);
            }

            $atual->status = $novoStatus;
            $atual->save(); // atualiza data_atualizacao automaticamente

            return $atual;
        });
    }

    /**
     * Totais para a tela inicial. Todos os valores possíveis aparecem na resposta,
     * inclusive os que não têm nenhuma solicitação (contagem zero).
     *
     * @return array{total: int, por_status: array<string, int>, por_prioridade: array<string, int>}
     */
    public function resumo(): array
    {
        $porStatus = $this->contarPor('status', Status::cases());

        return [
            'total' => array_sum($porStatus),
            'por_status' => $porStatus,
            'por_prioridade' => $this->contarPor('prioridade', Prioridade::cases()),
        ];
    }

    /**
     * @param  list<BackedEnum>  $valores
     * @return array<string, int>
     */
    private function contarPor(string $coluna, array $valores): array
    {
        $contagens = Solicitacao::query()
            ->toBase()
            ->select($coluna)
            ->selectRaw('count(*) as total')
            ->groupBy($coluna)
            ->pluck('total', $coluna);

        $resultado = [];
        foreach ($valores as $valor) {
            $resultado[$valor->value] = (int) ($contagens[$valor->value] ?? 0);
        }

        return $resultado;
    }
}
