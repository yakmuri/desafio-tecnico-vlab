<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();
            $table->string('protocolo', 30)->unique();
            $table->string('nome_solicitante', 150);
            $table->string('categoria', 20);
            $table->string('prioridade', 20);
            $table->string('status', 20)->default('RECEBIDA');
            $table->text('descricao');
            $table->text('justificativa_prioridade')->nullable();
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_atualizacao')->useCurrent();

            $table->index('status');
            $table->index('prioridade');
        });

        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_categoria_check
            CHECK (categoria IN ('CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'))");

        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_prioridade_check
            CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE'))");

        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_status_check
            CHECK (status IN ('RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'))");

        DB::statement("ALTER TABLE solicitacoes ADD CONSTRAINT solicitacoes_justificativa_urgente_check
            CHECK (prioridade <> 'URGENTE' OR (justificativa_prioridade IS NOT NULL AND btrim(justificativa_prioridade) <> ''))");
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};
