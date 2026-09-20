<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('solicitacoes', \App\Http\Controllers\Api\V1\SolicitacaoController::class)
        ->only(['index', 'store', 'show'])
        ->parameters(['solicitacoes' => 'solicitacao']);

    Route::patch(
        'solicitacoes/{solicitacao}/status',
        [\App\Http\Controllers\Api\V1\SolicitacaoController::class, 'atualizarStatus']
    );
});
