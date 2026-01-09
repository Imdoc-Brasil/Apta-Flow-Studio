/**
 * Utilitários para avaliação de riscos no PGR
 */

import type { Hazard } from '@/app/dashboard/(main)/risks/page'

export type RiskLevelLabel =
    | 'Irrelevante'
    | 'Leve'
    | 'Médio'
    | 'Alto'
    | 'Crítico'

export type RiskColor =
    | 'bg-gray-300'
    | 'bg-lime-200'
    | 'bg-yellow-200'
    | 'bg-orange-300'
    | 'bg-red-400'
    | 'bg-red-500'

export interface RiskEvaluation {
    frequency: number
    severity: number
    riskLevel: number
    riskLabel: RiskLevelLabel
    riskColor: RiskColor
    riskDescription: string
}

export const riskMatrixConfig = {
    levels: {
        '1': {
            label: 'Irrelevante' as RiskLevelLabel,
            color: 'bg-lime-200' as RiskColor,
            description:
                'Fatores do ambiente ou elementos materiais que não constituem nenhum incômodo, nenhum risco para a saúde ou integridade física',
        },
        '2': {
            label: 'Leve' as RiskLevelLabel,
            color: 'bg-yellow-200' as RiskColor,
            description:
                'Fatores do ambiente ou elementos materiais que constituem um incômodo sem ser uma fonte de risco para a saúde ou integridade física',
        },
        '3': {
            label: 'Médio' as RiskLevelLabel,
            color: 'bg-orange-300' as RiskColor,
            description:
                'Fatores do ambiente ou elementos materiais que constituem um incômodo, podendo ser de médio risco para saúde ou integridade física',
        },
        '4': {
            label: 'Alto' as RiskLevelLabel,
            color: 'bg-red-400' as RiskColor,
            description:
                'Fatores do ambiente ou elementos materiais que constituem um risco alto para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente próximos do nível de ação',
        },
        '5': {
            label: 'Crítico' as RiskLevelLabel,
            color: 'bg-red-500' as RiskColor,
            description:
                'Fatores do ambiente ou elementos materiais que constituem um risco critico para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente acima dos limites de tolerância',
        },
    },
    matrix: [
        // Frequência (Colunas) vs Severidade (Linhas)
        // Frequência:  1, 2, 3, 4, 5
        [1, 1, 2, 3, 4], // Severidade 1
        [1, 2, 3, 4, 4], // Severidade 2
        [2, 3, 4, 4, 5], // Severidade 3
        [3, 4, 4, 5, 5], // Severidade 4
        [4, 4, 5, 5, 5], // Severidade 5
    ],
}

export const getRiskLevel = (
    frequency: number,
    severity: number
): RiskEvaluation => {
    const freqIndex = frequency - 1
    const sevIndex = severity - 1

    if (freqIndex < 0 || sevIndex < 0) {
        return {
            frequency,
            severity,
            riskLevel: 0,
            riskLabel: 'Irrelevante',
            riskColor: 'bg-gray-300',
            riskDescription: 'Selecione a frequência e a classificação de efeito.',
        }
    }

    const levelIndex = riskMatrixConfig.matrix[sevIndex][freqIndex]
    const levelInfo =
        riskMatrixConfig.levels[
        levelIndex.toString() as keyof typeof riskMatrixConfig.levels
        ]

    return {
        frequency,
        severity,
        riskLevel: levelIndex,
        riskLabel: levelInfo.label,
        riskColor: levelInfo.color,
        riskDescription: levelInfo.description,
    }
}

export const getHazardById = (
    hazardId: string,
    hazards?: Hazard[] | null
) => {
    if (!hazards) return null
    return hazards.find((h) => h.id === hazardId)
}
