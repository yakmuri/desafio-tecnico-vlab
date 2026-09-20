<?php

use App\Http\Controllers\Api\V1\SolicitacaoController;
use Illuminate\Support\Facades\Route;

// O id precisa ser numérico (até 18 dígitos, cabe em bigint). Sem isso, um valor
// como "abc" chegaria ao PostgreSQL e causaria erro 500 em vez de 404.
Route::pattern('solicitacao', '[0-9]{1,18}');

Route::prefix('v1')->group(function () {
    Route::apiResource('solicitacoes', SolicitacaoController::class)
        ->only(['index', 'store', 'show'])
        ->parameters(['solicitacoes' => 'solicitacao']);

    Route::patch('solicitacoes/{solicitacao}/status', [SolicitacaoController::class, 'atualizarStatus']);
});
