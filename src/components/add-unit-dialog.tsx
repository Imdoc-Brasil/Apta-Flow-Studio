'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import type { Client } from '@/lib/types/client'
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useFirestore,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Unit, UnitType } from '@/lib/types/unit'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

interface AddUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  contractId: string
  unitToEdit: Unit | null
}

export function AddUnitDialog({
  open,
  onOpenChange,
  client,
  contractId,
  unitToEdit,
}: AddUnitDialogProps) {
  const { toast } = useToast()
  const firestore = useFirestore()

  const [formType, setFormType] = useState<UnitType>('Unidade')
  const [inheritData, setInheritData] = useState(false)

  // Controlled states for fields
  const [unitName, setUnitName] = useState('')
  const [unitDescription, setUnitDescription] = useState('')
  const [unitCnpj, setUnitCnpj] = useState('')
  const [unitCnae, setUnitCnae] = useState('')
  const [unitRiskLevel, setUnitRiskLevel] = useState('')
  const [unitCno, setUnitCno] = useState('')
  const [unitLegalResp, setUnitLegalResp] = useState('')
  const [unitPgrResp, setUnitPgrResp] = useState('')
  const [unitLtcatResp, setUnitLtcatResp] = useState('')
  const [unitPcmsoResp, setUnitPcmsoResp] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('Brasil')
  const [totalArea, setTotalArea] = useState('')
  const [builtArea, setBuiltArea] = useState('')

  const [contractingName, setContractingName] = useState('')
  const [contractingCnpj, setContractingCnpj] = useState('')
  const [contractingCnae, setContractingCnae] = useState('')
  const [contractingRiskLevel, setContractingRiskLevel] = useState('')

  const resetForm = () => {
    setFormType('Unidade')
    setInheritData(false)
    setUnitName('')
    setUnitDescription('')
    setUnitCnpj('')
    setUnitCnae('')
    setUnitRiskLevel('')
    setUnitCno('')
    setUnitLegalResp('')
    setUnitPgrResp('')
    setUnitLtcatResp('')
    setUnitPcmsoResp('')
    setAddress('')
    setZipCode('')
    setNeighborhood('')
    setCity('')
    setState('')
    setCountry('Brasil')
    setTotalArea('')
    setBuiltArea('')
    setContractingName('')
    setContractingCnpj('')
    setContractingCnae('')
    setContractingRiskLevel('')
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    } else if (unitToEdit) {
      setFormType(unitToEdit.type)
      setUnitName(unitToEdit.name || '')
      setUnitDescription(unitToEdit.description || '')
      setUnitCnpj(unitToEdit.cnpj || '')
      setUnitCnae(unitToEdit.cnae || '')
      setUnitRiskLevel(unitToEdit.riskLevel || '')
      setUnitCno(unitToEdit.cno || '')
      setUnitLegalResp(unitToEdit.legalResponsible || '')
      setUnitPgrResp(unitToEdit.pgrResponsible || '')
      setUnitLtcatResp(unitToEdit.ltcatResponsible || '')
      setUnitPcmsoResp(unitToEdit.pcmsoResponsible || '')
      setAddress(unitToEdit.propertyInfo?.address || '')
      setZipCode(unitToEdit.propertyInfo?.zipCode || '')
      setNeighborhood(unitToEdit.propertyInfo?.neighborhood || '')
      setCity(unitToEdit.propertyInfo?.city || '')
      setState(unitToEdit.propertyInfo?.state || '')
      setCountry(unitToEdit.propertyInfo?.country || 'Brasil')
      setTotalArea(unitToEdit.propertyInfo?.totalArea || '')
      setBuiltArea(unitToEdit.propertyInfo?.builtArea || '')
      if (unitToEdit.contractingCompany) {
        setContractingName(unitToEdit.contractingCompany.name || '')
        setContractingCnpj(unitToEdit.contractingCompany.cnpj || '')
        setContractingCnae(unitToEdit.contractingCompany.cnae || '')
        setContractingRiskLevel(unitToEdit.contractingCompany.riskLevel || '')
      }
    }
  }, [open, unitToEdit])

  useEffect(() => {
    if (inheritData && client && !unitToEdit) {
      setUnitName(client.name || '')
      setUnitCnpj(client.cnpj || '')
      setUnitCnae(client.cnae || '')
      setUnitRiskLevel(client.riskLevel || '')
      setAddress(client.address || '')
    } else if (!inheritData && !unitToEdit) {
      resetForm()
    }
  }, [inheritData, client, unitToEdit])

  const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firestore) {
      toast({
        title: 'Erro de Conexão',
        description: 'Não foi possível conectar ao banco de dados.',
        variant: 'destructive'
      })
      return;
    }
    const unitsRef = collection(firestore, 'clients', contractId, 'units')

    const removeUndefined = (obj: any): any => {
      const cleaned: any = {}
      Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const nested = removeUndefined(obj[key])
            if (Object.keys(nested).length > 0) {
              cleaned[key] = nested
            }
          } else {
            cleaned[key] = obj[key]
          }
        }
      })
      return cleaned
    }

    const newUnitData: Omit<Unit, 'id'> = {
      name: unitName,
      type: formType,
      description: unitDescription,
      cnpj: unitCnpj,
      cno: formType === 'Obra' ? unitCno : undefined,
      contractingCompany:
        formType === 'Contrato'
          ? {
              name: contractingName,
              cnpj: contractingCnpj,
              cnae: contractingCnae,
              riskLevel: contractingRiskLevel,
            }
          : undefined,
      propertyInfo: {
        address: address,
        zipCode: zipCode,
        neighborhood: neighborhood,
        city: city,
        state: state,
        country: country,
        totalArea: totalArea,
        builtArea: builtArea,
      },
      cnae: unitCnae,
      riskLevel: unitRiskLevel,
      legalResponsible: unitLegalResp,
      pgrResponsible: unitPgrResp,
      ltcatResponsible: unitLtcatResp,
      pcmsoResponsible: unitPcmsoResp,
      status: unitToEdit?.status || 'Ativa',
    }

    const cleanedData = removeUndefined(newUnitData)

    if (unitToEdit?.id) {
      const unitDocRef = doc(
        firestore,
        'clients',
        contractId,
        'units',
        unitToEdit.id
      )
      updateDocumentNonBlocking(unitDocRef, cleanedData)
      toast({ title: 'Unidade Atualizada!' })
    } else {
      addDocumentNonBlocking(unitsRef, cleanedData)
      toast({
        title: 'Unidade Adicionada!',
        description: `A unidade "${cleanedData.name}" foi adicionada com sucesso.`,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {unitToEdit ? 'Editar' : 'Adicionar Nova'} Unidade/Obra/Contrato
          </DialogTitle>
          <DialogDescription>
            {unitToEdit
              ? 'Atualize os detalhes da estrutura.'
              : 'Preencha os detalhes da nova estrutura.'}
            <span className='block mt-2 text-xs text-muted-foreground'>
              * Campos obrigatórios
            </span>
          </DialogDescription>
        </DialogHeader>
        <form id='add-unit-form' onSubmit={handleAddUnit}>
          <ScrollArea className='h-[60vh] pr-6'>
            <div className='grid gap-4 py-4'>
              {!unitToEdit && (
                <div className='flex items-center space-x-2 mb-4'>
                  <Checkbox
                    id='inherit'
                    checked={inheritData}
                    onCheckedChange={(checked) =>
                      setInheritData(checked as boolean)
                    }
                  />
                  <Label htmlFor='inherit' className='cursor-pointer'>
                    Herdar dados da empresa principal
                  </Label>
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='type'>Tipo</Label>
                <Select
                  name='type'
                  value={formType}
                  onValueChange={(value) => setFormType(value as UnitType)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Unidade'>Unidade</SelectItem>
                    <SelectItem value='Obra'>Obra</SelectItem>
                    <SelectItem value='Contrato'>Contrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formType === 'Obra' && (
                <div className='space-y-2'>
                  <Label htmlFor='cno'>Número do CNO</Label>
                  <Input
                    id='cno'
                    name='cno'
                    value={unitCno}
                    onChange={(e) => setUnitCno(e.target.value)}
                  />
                </div>
              )}

              {formType === 'Contrato' && (
                <fieldset className='grid gap-4 rounded-lg border p-4'>
                  <legend className='-ml-1 px-1 text-sm font-medium'>
                    Informações da Contratante
                  </legend>
                  <div className='space-y-2'>
                    <Label htmlFor='contractingName'>Razão Social</Label>
                    <Input
                      id='contractingName'
                      name='contractingName'
                      value={contractingName}
                      onChange={(e) => setContractingName(e.target.value)}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='contractingCnpj'>CNPJ</Label>
                      <Input
                        id='contractingCnpj'
                        name='contractingCnpj'
                        value={contractingCnpj}
                        onChange={(e) => setContractingCnpj(e.target.value)}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contractingCnae'>CNAE</Label>
                      <Input
                        id='contractingCnae'
                        name='contractingCnae'
                        value={contractingCnae}
                        onChange={(e) => setContractingCnae(e.target.value)}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contractingRiskLevel'>
                        Grau de Risco
                      </Label>
                      <Input
                        id='contractingRiskLevel'
                        name='contractingRiskLevel'
                        value={contractingRiskLevel}
                        onChange={(e) =>
                          setContractingRiskLevel(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              <div className='space-y-2'>
                <Label htmlFor='name'>Nome *</Label>
                <Input
                  id='name'
                  name='name'
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder='Digite o nome da unidade'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Descrição</Label>
                <Textarea
                  id='description'
                  name='description'
                  value={unitDescription}
                  onChange={(e) => setUnitDescription(e.target.value)}
                  placeholder='Descrição opcional da unidade'
                />
              </div>

              <fieldset className='grid gap-4 rounded-lg border p-4'>
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  Informações Gerais
                </legend>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='cnpj'>CNPJ</Label>
                    <Input
                      id='cnpj'
                      name='cnpj'
                      value={unitCnpj}
                      onChange={(e) => setUnitCnpj(e.target.value)}
                      placeholder='00.000.000/0000-00'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cnae'>CNAE</Label>
                    <Input
                      id='cnae'
                      name='cnae'
                      value={unitCnae}
                      onChange={(e) => setUnitCnae(e.target.value)}
                      placeholder='0000-0/00'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='riskLevel'>Grau de Risco</Label>
                    <Input
                      id='riskLevel'
                      name='riskLevel'
                      value={unitRiskLevel}
                      onChange={(e) => setUnitRiskLevel(e.target.value)}
                      placeholder='1-4'
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className='grid gap-4 rounded-lg border p-4'>
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  Informações do Imóvel
                </legend>
                <div className='space-y-2'>
                  <Label htmlFor='add-address'>Endereço Completo *</Label>
                  <Input
                    id='add-address'
                    name='add-address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Rua, Número, Complemento'
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='add-zipCode'>CEP</Label>
                    <Input
                      id='add-zipCode'
                      name='add-zipCode'
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder='00000-000'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-neighborhood'>Bairro</Label>
                    <Input
                      id='add-neighborhood'
                      name='add-neighborhood'
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder='Nome do bairro'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-city'>Cidade</Label>
                    <Input
                      id='add-city'
                      name='add-city'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder='Nome da cidade'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-state'>Estado</Label>
                    <Input
                      id='add-state'
                      name='add-state'
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder='UF (ex: SP)'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-country'>País</Label>
                    <Input
                      id='add-country'
                      name='add-country'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-totalArea'>Área Total</Label>
                    <Input
                      id='add-totalArea'
                      name='add-totalArea'
                      value={totalArea}
                      onChange={(e) => setTotalArea(e.target.value)}
                      placeholder='Ex: 1000 m²'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='add-builtArea'>Área Construída</Label>
                    <Input
                      id='add-builtArea'
                      name='add-builtArea'
                      value={builtArea}
                      onChange={(e) => setBuiltArea(e.target.value)}
                      placeholder='Ex: 800 m²'
                    />
                  </div>
                </div>
              </fieldset>

              <div className='space-y-4 pt-4 border-t'>
                <h3 className='font-medium text-lg'>Responsáveis</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='legalResponsible'>Responsável Legal</Label>
                    <Input
                      id='legalResponsible'
                      name='legalResponsible'
                      value={unitLegalResp}
                      onChange={(e) => setUnitLegalResp(e.target.value)}
                      placeholder='Nome do responsável legal'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='pgrResponsible'>
                      Responsável pelo PGR
                    </Label>
                    <Input
                      id='pgrResponsible'
                      name='pgrResponsible'
                      value={unitPgrResp}
                      onChange={(e) => setUnitPgrResp(e.target.value)}
                      placeholder='Nome do responsável pelo PGR'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='ltcatResponsible'>
                      Responsável pelo LTCAT
                    </Label>
                    <Input
                      id='ltcatResponsible'
                      name='ltcatResponsible'
                      value={unitLtcatResp}
                      onChange={(e) => setUnitLtcatResp(e.target.value)}
                      placeholder='Nome do responsável pelo LTCAT'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='pcmsoResponsible'>
                      Responsável pelo PCMSO
                    </Label>
                    <Input
                      id='pcmsoResponsible'
                      name='pcmsoResponsible'
                      value={unitPcmsoResp}
                      onChange={(e) => setUnitPcmsoResp(e.target.value)}
                      placeholder='Nome do responsável pelo PCMSO'
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='add-unit-form'>
            {unitToEdit ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
