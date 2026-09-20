<?php

namespace App\Http\Requests;

use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(Status::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'O novo status é obrigatório.',
            'status.enum' => 'O status deve ser RECEBIDA, EM_ANALISE, AGENDADA, CONCLUIDA ou CANCELADA.',
        ];
    }
}
