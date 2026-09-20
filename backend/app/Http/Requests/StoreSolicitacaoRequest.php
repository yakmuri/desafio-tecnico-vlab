<?php

namespace App\Http\Requests;

use App\Enums\Categoria;
use App\Enums\Prioridade;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSolicitacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // "status" e "protocolo" não são aceitos: quem define é a aplicação.
        return [
            'nome_solicitante' => ['required', 'string', 'max:150'],
            'categoria' => ['required', Rule::enum(Categoria::class)],
            'prioridade' => ['required', Rule::enum(Prioridade::class)],
            'descricao' => ['required', 'string', 'max:2000'],
            'justificativa_prioridade' => ['nullable', 'string', 'max:2000', 'required_if:prioridade,URGENTE'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome_solicitante.required' => 'O nome do solicitante é obrigatório.',
            'nome_solicitante.string' => 'O nome do solicitante deve ser um texto.',
            'nome_solicitante.max' => 'O nome do solicitante deve ter no máximo 150 caracteres.',
            'categoria.required' => 'A categoria é obrigatória.',
            'categoria.enum' => 'A categoria deve ser CONSULTA, EXAME, VACINACAO ou OUTRO.',
            'prioridade.required' => 'A prioridade é obrigatória.',
            'prioridade.enum' => 'A prioridade deve ser BAIXA, MEDIA, ALTA ou URGENTE.',
            'descricao.required' => 'A descrição é obrigatória.',
            'descricao.string' => 'A descrição deve ser um texto.',
            'descricao.max' => 'A descrição deve ter no máximo 2000 caracteres.',
            'justificativa_prioridade.required_if' => 'A justificativa da prioridade é obrigatória quando a prioridade é URGENTE.',
            'justificativa_prioridade.string' => 'A justificativa da prioridade deve ser um texto.',
            'justificativa_prioridade.max' => 'A justificativa da prioridade deve ter no máximo 2000 caracteres.',
        ];
    }
}
