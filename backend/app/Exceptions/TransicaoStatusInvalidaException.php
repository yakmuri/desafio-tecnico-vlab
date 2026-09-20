<?php

namespace App\Exceptions;

use App\Enums\Status;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class TransicaoStatusInvalidaException extends RuntimeException
{
    public function __construct(
        public readonly Status $atual,
        public readonly Status $novo,
    ) {
        $permitidos = self::valores($atual->proximosPermitidos());

        $mensagem = $permitidos === []
            ? "A solicitação já está {$atual->value}, que é um status final, e não permite nova alteração."
            : "Não é possível alterar o status de {$atual->value} para {$novo->value}. "
                . 'Próximos status permitidos: ' . implode(', ', $permitidos) . '.';

        parent::__construct($mensagem);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'status_atual' => $this->atual->value,
            'status_solicitado' => $this->novo->value,
            'status_permitidos' => self::valores($this->atual->proximosPermitidos()),
        ], 422);
    }

    /** @param list<Status> $status */
    private static function valores(array $status): array
    {
        return array_map(fn (Status $s) => $s->value, $status);
    }
}
