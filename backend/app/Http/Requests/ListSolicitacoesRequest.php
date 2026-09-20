<?php

namespace App\Http\Requests;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListSolicitacoesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(Status::class)],
            'categoria' => ['sometimes', Rule::enum(Categoria::class)],
            'prioridade' => ['sometimes', Rule::enum(Prioridade::class)],
            'protocolo' => ['sometimes', 'string', 'max:30'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.enum' => 'O filtro status deve ser RECEBIDA, EM_ANALISE, AGENDADA, CONCLUIDA ou CANCELADA.',
            'categoria.enum' => 'O filtro categoria deve ser CONSULTA, EXAME, VACINACAO ou OUTRO.',
            'prioridade.enum' => 'O filtro prioridade deve ser BAIXA, MEDIA, ALTA ou URGENTE.',
            'protocolo.string' => 'O filtro protocolo deve ser um texto.',
            'protocolo.max' => 'O filtro protocolo deve ter no máximo 30 caracteres.',
            'per_page.integer' => 'O parâmetro per_page deve ser um número inteiro.',
            'per_page.min' => 'O parâmetro per_page deve ser no mínimo 1.',
            'per_page.max' => 'O parâmetro per_page deve ser no máximo 100.',
            'page.integer' => 'O parâmetro page deve ser um número inteiro.',
            'page.min' => 'O parâmetro page deve ser no mínimo 1.',
        ];
    }
}
