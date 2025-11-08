'use client'

import React, { useCallback, useState } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlusCircle, FolderOpen } from 'lucide-react'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Início do Processo' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Etapa 1' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Etapa 2' },
    position: { x: 250, y: 200 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Fim do Processo' },
    position: { x: 250, y: 300 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
]

const salesProcessNodes: Node[] = [
  { id: 's1', type: 'input', data: { label: 'Lead Recebido' }, position: { x: 100, y: 50 } },
  { id: 's2', data: { label: 'Qualificação' }, position: { x: 100, y: 150 } },
  { id: 's3', data: { label: 'Apresentação da Proposta' }, position: { x: 300, y: 150 } },
  { id: 's4', data: { label: 'Negociação' }, position: { x: 300, y: 250 } },
  { id: 's5', type: 'output', data: { label: 'Venda Fechada' }, position: { x: 300, y: 350 } },
]

const salesProcessEdges: Edge[] = [
  { id: 'es1-2', source: 's1', target: 's2' },
  { id: 'es2-3', source: 's2', target: 's3' },
  { id: 'es3-4', source: 's3', target: 's4' },
  { id: 'es4-5', source: 's4', target: 's5' },
]


export default function ProcessDiagramPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleNewDiagram = () => {
    setNodes([])
    setEdges([])
  }

  const loadDiagram = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes)
    setEdges(newEdges)
  }

  return (
    <div className='flex h-[calc(100vh-10rem)] flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-headline text-3xl font-bold'>
            Construtor de Diagramas
          </h1>
          <p className='text-muted-foreground'>
            Arraste e conecte os nós para montar seu fluxo de processo.
          </p>
        </div>
        <div className='flex gap-2'>
            <Button variant='outline' onClick={handleNewDiagram}>
              <PlusCircle className='mr-2 h-4 w-4'/>
              Novo Diagrama
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <FolderOpen className='mr-2 h-4 w-4'/>
                  Abrir Diagrama
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => loadDiagram(initialNodes, initialEdges)}>
                  Processo de Exemplo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadDiagram(salesProcessNodes, salesProcessEdges)}>
                  Processo de Vendas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className='flex-1 rounded-lg border bg-background'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant='dots' gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
