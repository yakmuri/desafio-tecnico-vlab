<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            // Filtro por categoria (os de status e prioridade já existem na migration de criação).
            $table->index('categoria');

            // Ordenação padrão da listagem: data_criacao DESC, id DESC.
            $table->index(['data_criacao', 'id']);
        });
    }

    public function down(): void
    {
        Schema::table('solicitacoes', function (Blueprint $table) {
            $table->dropIndex(['categoria']);
            $table->dropIndex(['data_criacao', 'id']);
        });
    }
};
