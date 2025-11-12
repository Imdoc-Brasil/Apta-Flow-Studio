
'use client'

import { useState, useMemo } from 'react'
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
import { PlusCircle, ChevronsRight, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import type { Exam } from '@/app/dashboard/(main)/health/data/exams'
import type { Hazard } from '@/app/dashboard/(main)/risks/page'

interface PcmsoRule {
  id: string
  riskId: string
  examIds: string[]
}

export default function PcmsoPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()
  const { toast } = useToast()

  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const { data: hazardData, isLoading: isLoadingHazards } =
    useCollection<Hazard>(hazardsRef)

  const medicalExamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'medical_exams') : null),
    [firestore]
  )
  const { data: medicalExams, isLoading: isLoadingExams } =
    useCollection<Exam>(medicalExamsRef)

  const pcmsoRulesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pcmso_rules`)
        : null,
    [firestore, contractId]
  )
  const { data: rules, isLoading: isLoadingRules } =
    useCollection<PcmsoRule>(pcmsoRulesRef)

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<string>('')
  const [selectedExams, setSelectedExams] = useState<string[]>([])

  const getRiskName = (riskId: string) => {
    return hazardData?.find((h) => h.id === riskId)?.name || 'N/A'
  }

  const getExamName = (examId: string) => {
    return medicalExams?.find((e) => e.code === examId)?.name || 'N/A'
  }

  const openRuleDialog = () => {
    setSelectedRisk('')
    setSelectedExams([])
    setIsRuleDialogOpen(true)
  }

  const handleRuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedRisk || selectedExams.length === 0 || !pcmsoRulesRef) {
      toast({
        variant: 'destructive',
        title: 'Seleção Incompleta',
        description: 'Por favor, selecione um risco e ao menos um exame.',
      })
      return
    }

    const newRule: Omit<PcmsoRule, 'id'> = {
      riskId: selectedRisk,
      examIds: selectedExams,
    }

    addDocumentNonBlocking(pcmsoRulesRef, newRule)

    setIsRuleDialogOpen(false)
    toast({
      title: 'Regra Adicionada!',
      description: 'A nova regra do PCMSO foi salva.',
    })
  }

  const isLoading = isLoadingExams || isLoadingRules || isLoadingHazards

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
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risco Ocupacional</TableHead>
                  <TableHead>Exames Vinculados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules?.map((rule) => (
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
          )}
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
                <Select
                  value={selectedRisk}
                  onValueChange={setSelectedRisk}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um risco' />
                  </SelectTrigger>
                  <SelectContent>
                    {hazardData?.map((hazard) => (
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
                  {isLoadingExams ? (
                    <div className='flex justify-center items-center h-full'>
                      <Loader2 className='h-6 w-6 animate-spin' />
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {medicalExams?.map((exam) => (
                        <div key={exam.code} className='flex items-center gap-2'>
                          <Checkbox
                            id={`exam-${exam.code}`}
                            checked={selectedExams.includes(exam.code)}
                            onCheckedChange={(checked) => {
                              setSelectedExams((prev) =>
                                checked
                                  ? [...prev, exam.code]
                                  : prev.filter((id) => id !== exam.code)
                              )
                            }}
                          />
                          <Label
                            htmlFor={`exam-${exam.code}`}
                            className='font-normal'
                          >
                            {exam.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
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

    