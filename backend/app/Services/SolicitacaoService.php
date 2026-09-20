<?php

namespace App\Services;

use App\Enums\Status;
use App\Exceptions\TransicaoStatusInvalidaException;
use App\Models\Solicitacao;
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
}
