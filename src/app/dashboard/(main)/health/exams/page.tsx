
'use client'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Exam, type ExamCategory } from '../data/exams'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { Loader2, Search } from 'lucide-react'
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'
import { collection } from 'firebase/firestore'

const categories: ExamCategory[] = [
  'Exame Clínico/Físico',
  'Exame Laboratorial',
  'Exame de Imagem',
  'Exame Gráfico',
  'Outros',
]

const ExamsTable = ({
  exams,
  isLoading,
}: {
  exams: Exam[]
  isLoading: boolean
}) => {
  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Código eSocial</TableHead>
            <TableHead>Nome do Exame</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={2} className='h-24 text-center'>
                <Loader2 className='mx-auto h-6 w-6 animate-spin' />
              </TableCell>
            </TableRow>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <TableRow key={exam.code}>
                <TableCell className='font-medium'>{exam.code}</TableCell>
                <TableCell>{exam.name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className='h-24 text-center'>
                Nenhum exame encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function ExamsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const firestore = useFirestore()
  const examsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'medical_exams') : null),
    [firestore]
  )
  const { data: allExams, isLoading } = useCollection<Exam>(examsRef)

  const filteredExams = useMemo(() => {
    if (!allExams) return []
    if (!searchTerm) {
      return allExams
    }
    return allExams.filter(
      (exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.code.includes(searchTerm)
    )
  }, [allExams, searchTerm])

  const examsByCategory = (category: ExamCategory) => {
    return filteredExams.filter((exam) => exam.category === category)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Catálogo de Exames
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Exames Ocupacionais</CardTitle>
          <CardDescription>
            Consulte todos os exames clínicos, laboratoriais e de imagem
            previstos, com base na tabela 27 do eSocial.
          </CardDescription>
          <div className='pt-4'>
            <div className='relative w-full max-w-md'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por nome ou código do exame...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='Exame Laboratorial'>
            <TabsList className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <ExamsTable
                  exams={examsByCategory(category)}
                  isLoading={isLoading}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
