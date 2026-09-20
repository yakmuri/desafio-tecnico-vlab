<?php

namespace App\Models;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Solicitacao extends Model
{
    public const CREATED_AT = 'data_criacao';
    public const UPDATED_AT = 'data_atualizacao';

    // Sem isso o Laravel tentaria "solicitacaos" (plural em inglês).
    protected $table = 'solicitacoes';

    // O protocolo não é fillable: quem gera é a aplicação.
    protected $fillable = [
        'nome_solicitante',
        'categoria',
        'prioridade',
        'status',
        'descricao',
        'justificativa_prioridade',
    ];

    protected function casts(): array
    {
        return [
            'categoria' => Categoria::class,
            'prioridade' => Prioridade::class,
            'status' => Status::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Solicitacao $solicitacao) {
            $solicitacao->protocolo ??= static::gerarProtocolo();
            $solicitacao->status ??= Status::RECEBIDA;
        });
    }

    public static function gerarProtocolo(): string
    {
        do {
            $protocolo = 'SOL-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        } while (static::where('protocolo', $protocolo)->exists());

        return $protocolo;
    }
}
