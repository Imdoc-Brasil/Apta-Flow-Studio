
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
import { PlusCircle, ChevronsRight, Loader2, ListChecks } from 'lucide-react'
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
import type { Exam } from '@/lib/types/exam'
import type { Hazard, PgrInventoryItem } from '@/lib/types/risk'
import type { Role } from '@/lib/types/role'
import { Separator } from '@/components/ui/separator'

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

  // Firestore Refs
  const inventoryRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pgr_inventory`)
        : null,
    [firestore, contractId]
  )
  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const medicalExamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'medical_exams') : null),
    [firestore]
  )
  const pcmsoRulesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pcmso_rules`)
        : null,
    [firestore, contractId]
  )
  const rolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )

  // Data fetching
  const { data: inventoryData, isLoading: isLoadingInventory } =
    useCollection<PgrInventoryItem>(inventoryRef)
  const { data: hazardData, isLoading: isLoadingHazards } =
    useCollection<Hazard>(hazardsRef)
  const { data: medicalExams, isLoading: isLoadingExams } =
    useCollection<Exam>(medicalExamsRef)
  const { data: rules, isLoading: isLoadingRules } =
    useCollection<PcmsoRule>(pcmsoRulesRef)
  const { data: rolesData, isLoading: isLoadingRoles } =
    useCollection<Role>(rolesRef)

  // Dialog and form state
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<string>('')
  const [selectedExams, setSelectedExams] = useState<string[]>([])

  // Preview state
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [previewExams, setPreviewExams] = useState<Exam[]>([])
  const [previewLoading, setPreviewLoading] = useState(false)

  // Memoized data for performance
  const clientHazards = useMemo(() => {
    if (!inventoryData || !hazardData) return []
    const uniqueHazardIds = [
      ...new Set(inventoryData.map((item) => item.hazardId)),
    ]
    return hazardData.filter((hazard) => uniqueHazardIds.includes(hazard.id))
  }, [inventoryData, hazardData])

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

  const generatePreview = () => {
    if (!selectedRole || !inventoryData || !rules || !medicalExams) {
      toast({
        title: 'Seleção Necessária',
        description: 'Selecione um cargo para gerar a prévia.',
      })
      return
    }
    setPreviewLoading(true)

    const role = rolesData?.find((r) => r.id === selectedRole)
    if (!role) {
      setPreviewLoading(false)
      return
    }

    // Find risks associated with the role's sector
    const sectorRisks = inventoryData
      .filter((item) => item.sector === role.sectorId) // This is a simplification, a real app might need more complex logic
      .map((item) => item.hazardId)

    const uniqueSectorRiskIds = [...new Set(sectorRisks)]

    // Find exams based on the rules for those risks
    const requiredExamIds = new Set<string>()
    rules.forEach((rule) => {
      if (uniqueSectorRiskIds.includes(rule.riskId)) {
        rule.examIds.forEach((examId) => requiredExamIds.add(examId))
      }
    })

    const examsForRole = medicalExams.filter((exam) =>
      requiredExamIds.has(exam.code)
    )

    setPreviewExams(examsForRole)
    setTimeout(() => setPreviewLoading(false), 500) // Simulate loading
  }

  const isLoading =
    isLoadingExams ||
    isLoadingRules ||
    isLoadingHazards ||
    isLoadingInventory ||
    isLoadingRoles

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Prévia de Exames por Cargo</CardTitle>
            <CardDescription>
              Selecione um cargo para visualizar os exames necessários com base
              nos riscos associados e nas regras definidas.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-end gap-2'>
              <div className='flex-grow space-y-2'>
                <Label htmlFor='role-preview'>Cargo</Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  disabled={isLoadingRoles}
                >
                  <SelectTrigger id='role-preview'>
                    <SelectValue placeholder='Selecione um cargo' />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesData?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generatePreview} disabled={!selectedRole || previewLoading}>
                {previewLoading ? (
                   <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <ListChecks className='mr-2 h-4 w-4' />
                )}
                Gerar Prévia
              </Button>
            </div>
            {previewExams.length > 0 && !previewLoading && (
              <div className='pt-4 animate-in fade-in-50'>
                 <h4 className="text-sm font-semibold mb-2">Exames recomendados para <span className="text-primary">{rolesData?.find(r => r.id === selectedRole)?.name}</span>:</h4>
                <div className='border rounded-md p-4'>
                  <ul className='space-y-1 list-disc list-inside'>
                    {previewExams.map((exam) => (
                      <li key={exam.code}>{exam.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
             {!previewLoading && selectedRole && previewExams.length === 0 && (
                <div className="text-center text-sm text-muted-foreground pt-6">Nenhum exame vinculado aos riscos deste cargo.</div>
             )}
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Matriz de Exames (Regras do PCMSO)
              <Button size='sm' onClick={openRuleDialog}>
                <PlusCircle className='mr-2 h-4 w-4' />
                Adicionar Regra
              </Button>
            </CardTitle>
            <CardDescription>
              Vincule os riscos ocupacionais aos exames médicos necessários.
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
      </div>

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
            <div className='grid grid-cols-[1fr_auto_1fr] items-start gap-4 py-8'>
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
                    {clientHazards?.map((hazard) => (
                      <SelectItem key={hazard.id} value={hazard.id}>
                        {hazard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seta */}
              <ChevronsRight className='h-8 w-8 text-muted-foreground self-center' />

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
