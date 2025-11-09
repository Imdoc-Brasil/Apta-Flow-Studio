
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Check, PlusCircle, ChevronsRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialHazardData, type Hazard } from '@/app/dashboard/(main)/risks/page'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const initialMedicalExams = [
  { id: 'EXM-01', name: 'Avaliação Clínica Ocupacional' },
  { id: 'EXM-02', name: 'Audiometria' },
  { id: 'EXM-03', name: 'Acuidade Visual' },
  { id: 'EXM-04', name: 'Espirometria' },
  { id: 'EXM-05', name: 'Eletrocardiograma (ECG)' },
  { id: 'EXM-06', name: 'Eletroencefalograma (EEG)' },
  { id: 'EXM-07', name: 'Raio-X de Tórax' },
  { id: 'EXM-08', name: 'Hemograma Completo' },
]

interface PcmsoRule {
  id: string
  riskId: string
  examIds: string[]
}

const initialPcmsoRules: PcmsoRule[] = [
  {
    id: 'RULE-01',
    riskId: 'RF-001', // Ruído Contínuo ou Intermitente
    examIds: ['EXM-01', 'EXM-02'], // Avaliação Clínica, Audiometria
  },
  {
    id: 'RULE-02',
    riskId: 'RE-001', // Levantamento de peso
    examIds: ['EXM-01'], // Avaliação Clínica
  },
]

export default function PcmsoPage() {
  const [rules, setRules] = useState(initialPcmsoRules)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<string>('')
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const { toast } = useToast()

  const getRiskName = (riskId: string) => {
    return initialHazardData.find((h) => h.id === riskId)?.name || 'N/A'
  }

  const getExamName = (examId: string) => {
    return initialMedicalExams.find((e) => e.id === examId)?.name || 'N/A'
  }

  const openRuleDialog = () => {
    setSelectedRisk('')
    setSelectedExams([])
    setIsRuleDialogOpen(true)
  }

  const handleRuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedRisk || selectedExams.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Seleção Incompleta',
        description: 'Por favor, selecione um risco e ao menos um exame.',
      })
      return
    }

    const newRule: PcmsoRule = {
      id: `RULE-${Date.now()}`,
      riskId: selectedRisk,
      examIds: selectedExams,
    }

    setRules((prev) => [...prev, newRule])
    setIsRuleDialogOpen(false)
    toast({
      title: 'Regra Adicionada!',
      description: 'A nova regra do PCMSO foi salva.',
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Gestão do PCMSO - Matriz de Exames
            <Button size='sm' onClick={openRuleDialog}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Adicionar Regra
            </Button>
          </CardTitle>
          <CardDescription>
            Vincule os riscos ocupacionais aos exames médicos necessários para
            cada tipo de ASO, conforme determinado pelo PCMSO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risco Ocupacional</TableHead>
                <TableHead>Exames Vinculados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className='font-medium'>
                    {getRiskName(rule.riskId)}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-2'>
                      {rule.examIds.map((examId) => (
                        <Badge key={examId} variant='secondary'>
                          {getExamName(examId)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Criar Nova Regra de Exames</DialogTitle>
            <DialogDescription>
              Selecione um risco e os exames que devem ser realizados quando um
              colaborador estiver exposto a ele.
            </DialogDescription>
          </DialogHeader>
          <form id='rule-form' onSubmit={handleRuleSubmit}>
            <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-8'>
              {/* Risco */}
              <div className='space-y-2'>
                <Label className='font-semibold text-center block'>
                  SE houver este Risco...
                </Label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk} required>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um risco' />
                  </SelectTrigger>
                  <SelectContent>
                    {initialHazardData.map((hazard) => (
                      <SelectItem key={hazard.id} value={hazard.id}>
                        {hazard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seta */}
              <ChevronsRight className='h-8 w-8 text-muted-foreground' />

              {/* Exames */}
              <div className='space-y-2'>
                <Label className='font-semibold text-center block'>
                  ENTÃO realize estes Exames
                </Label>
                <ScrollArea className='h-64 rounded-md border p-4'>
                  <div className='space-y-2'>
                    {initialMedicalExams.map((exam) => (
                      <div key={exam.id} className='flex items-center gap-2'>
                        <Checkbox
                          id={`exam-${exam.id}`}
                          checked={selectedExams.includes(exam.id)}
                          onCheckedChange={(checked) => {
                            setSelectedExams((prev) =>
                              checked
                                ? [...prev, exam.id]
                                : prev.filter((id) => id !== exam.id)
                            )
                          }}
                        />
                        <Label
                          htmlFor={`exam-${exam.id}`}
                          className='font-normal'
                        >
                          {exam.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsRuleDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='rule-form'>
              Salvar Regra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
