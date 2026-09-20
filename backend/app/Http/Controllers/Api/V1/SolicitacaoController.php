<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\SolicitacaoResource;
use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class SolicitacaoController extends Controller
{
    public function __construct(private readonly SolicitacaoService $service)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $filtros = $request->validate([
            'status' => ['sometimes', Rule::enum(Status::class)],
            'categoria' => ['sometimes', Rule::enum(Categoria::class)],
            'prioridade' => ['sometimes', Rule::enum(Prioridade::class)],
            'protocolo' => ['sometimes', 'string', 'max:30'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ], [
            'status.enum' => 'O filtro status deve ser RECEBIDA, EM_ANALISE, AGENDADA, CONCLUIDA ou CANCELADA.',
            'categoria.enum' => 'O filtro categoria deve ser CONSULTA, EXAME, VACINACAO ou OUTRO.',
            'prioridade.enum' => 'O filtro prioridade deve ser BAIXA, MEDIA, ALTA ou URGENTE.',
            'per_page.integer' => 'O parâmetro per_page deve ser um número inteiro.',
            'per_page.min' => 'O parâmetro per_page deve ser no mínimo 1.',
            'per_page.max' => 'O parâmetro per_page deve ser no máximo 100.',
        ]);

        $solicitacoes = Solicitacao::query()
            ->when($filtros['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($filtros['categoria'] ?? null, fn ($q, $v) => $q->where('categoria', $v))
            ->when($filtros['prioridade'] ?? null, fn ($q, $v) => $q->where('prioridade', $v))
            ->when($filtros['protocolo'] ?? null, fn ($q, $v) => $q->where('protocolo', $v))
            ->orderByDesc('data_criacao')
            ->orderByDesc('id')
            ->paginate($filtros['per_page'] ?? 15)
            ->withQueryString();

        return SolicitacaoResource::collection($solicitacoes);
    }

    public function store(StoreSolicitacaoRequest $request): JsonResponse
    {
        $solicitacao = Solicitacao::create($request->validated());

        return (new SolicitacaoResource($solicitacao))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Solicitacao $solicitacao): SolicitacaoResource
    {
        return new SolicitacaoResource($solicitacao);
    }

    public function atualizarStatus(UpdateStatusRequest $request, Solicitacao $solicitacao): SolicitacaoResource
    {
        $novoStatus = Status::from($request->validated('status'));

        return new SolicitacaoResource(
            $this->service->alterarStatus($solicitacao, $novoStatus)
        );
    }
}
