<?php

namespace App\Models;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Solicitacao extends Model
{
    public const CREATED_AT = 'data_criacao';

    public const UPDATED_AT = 'data_atualizacao';

    // Sem isso o Laravel tentaria "solicitacaos" (plural em inglês).
    protected $table = 'solicitacoes';

    // "protocolo" e "status" não são preenchíveis em massa: o protocolo é gerado
    // pela aplicação e o status só muda pelo SolicitacaoService, respeitando o fluxo.
    protected $fillable = [
        'nome_solicitante',
        'categoria',
        'prioridade',
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
            $solicitacao->status = Status::RECEBIDA;
        });
    }

    public function scopeFiltrar(Builder $query, array $filtros): Builder
    {
        return $query
            ->when($filtros['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($filtros['categoria'] ?? null, fn ($q, $v) => $q->where('categoria', $v))
            ->when($filtros['prioridade'] ?? null, fn ($q, $v) => $q->where('prioridade', $v))
            ->when($filtros['protocolo'] ?? null, fn ($q, $v) => $q->where('protocolo', $v));
    }

    public static function gerarProtocolo(): string
    {
        do {
            $protocolo = 'SOL-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
        } while (static::where('protocolo', $protocolo)->exists());

        return $protocolo;
    }
}
