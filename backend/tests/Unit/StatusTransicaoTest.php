<?php

namespace Tests\Unit;

use App\Enums\Status;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class StatusTransicaoTest extends TestCase
{
    /** @param list<Status> $esperados */
    #[DataProvider('fluxo')]
    public function test_proximos_status_permitidos(Status $atual, array $esperados): void
    {
        $this->assertSame($esperados, $atual->proximosPermitidos());
    }

    public static function fluxo(): array
    {
        return [
            'RECEBIDA' => [Status::RECEBIDA, [Status::EM_ANALISE, Status::CANCELADA]],
            'EM_ANALISE' => [Status::EM_ANALISE, [Status::AGENDADA, Status::CANCELADA]],
            'AGENDADA' => [Status::AGENDADA, [Status::CONCLUIDA, Status::CANCELADA]],
            'CONCLUIDA' => [Status::CONCLUIDA, []],
            'CANCELADA' => [Status::CANCELADA, []],
        ];
    }

    public function test_nao_permite_pular_etapas(): void
    {
        $this->assertFalse(Status::RECEBIDA->podeIrPara(Status::AGENDADA));
        $this->assertFalse(Status::RECEBIDA->podeIrPara(Status::CONCLUIDA));
        $this->assertFalse(Status::EM_ANALISE->podeIrPara(Status::CONCLUIDA));
    }

    public function test_nao_permite_voltar_etapas(): void
    {
        $this->assertFalse(Status::EM_ANALISE->podeIrPara(Status::RECEBIDA));
        $this->assertFalse(Status::AGENDADA->podeIrPara(Status::EM_ANALISE));
    }

    public function test_status_finais_nao_aceitam_nenhuma_transicao(): void
    {
        foreach ([Status::CONCLUIDA, Status::CANCELADA] as $final) {
            foreach (Status::cases() as $novo) {
                $this->assertFalse($final->podeIrPara($novo));
            }
        }
    }

    public function test_nenhum_status_pode_ir_para_si_mesmo(): void
    {
        foreach (Status::cases() as $status) {
            $this->assertFalse($status->podeIrPara($status));
        }
    }
}
