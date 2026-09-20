<?php

namespace App\Enums;

enum Status: string
{
    case RECEBIDA = 'RECEBIDA';
    case EM_ANALISE = 'EM_ANALISE';
    case AGENDADA = 'AGENDADA';
    case CONCLUIDA = 'CONCLUIDA';
    case CANCELADA = 'CANCELADA';

    /** @return list<Status> */
    public function proximosPermitidos(): array
    {
        return match ($this) {
            self::RECEBIDA => [self::EM_ANALISE, self::CANCELADA],
            self::EM_ANALISE => [self::AGENDADA, self::CANCELADA],
            self::AGENDADA => [self::CONCLUIDA, self::CANCELADA],
            self::CONCLUIDA, self::CANCELADA => [],
        };
    }

    public function podeIrPara(self $novo): bool
    {
        return in_array($novo, $this->proximosPermitidos(), true);
    }
}
