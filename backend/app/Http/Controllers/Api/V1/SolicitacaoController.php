<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListSolicitacoesRequest;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\SolicitacaoResource;
use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SolicitacaoController extends Controller
{
    public function __construct(private readonly SolicitacaoService $service) {}

    public function index(ListSolicitacoesRequest $request): AnonymousResourceCollection
    {
        $filtros = $request->validated();

        $solicitacoes = Solicitacao::query()
            ->filtrar($filtros)
            ->orderByDesc('data_criacao')
            ->orderByDesc('id')
            ->paginate($filtros['per_page'] ?? 15)
            ->withQueryString();

        return SolicitacaoResource::collection($solicitacoes);
    }

    public function resumo(): JsonResponse
    {
        return response()->json(['data' => $this->service->resumo()]);
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
