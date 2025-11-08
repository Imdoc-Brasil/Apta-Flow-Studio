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
import { PlusCircle, FolderOpen, MousePointerSquareDashed } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Custom node to allow editing
const EditableNode = ({ id, data, isConnectable }: { id: string; data: { label: string }; isConnectable: boolean }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const { setNodes } = useReactFlow()

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, label }
        }
        return node
      })
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  return (
    <div onDoubleClick={handleDoubleClick} className='p-2'>
      {isEditing ? (
        <Input
          type='text'
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className='nodrag' // Prevents dragging while editing
        />
      ) : (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          {label}
        </div>
      )}
    </div>
  )
}

// Custom diamond-shaped node for decisions
const DecisionNode = ({ id, data, isConnectable }: { id: string; data: { label: string }; isConnectable: boolean }) => {
  return (
    <div
      style={{
        width: 150,
        height: 100,
        backgroundColor: '#fff',
        border: '1px solid #000',
        transform: 'rotate(45deg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ transform: 'rotate(-45deg)', textAlign: 'center', padding: '10px' }}>
        {data.label}
      </div>
    </div>
  )
}

const nodeTypes = {
  decision: DecisionNode,
  default: EditableNode,
  input: EditableNode,
  output: EditableNode,
}

const exampleProcessNodes: Node[] = [
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

const exampleProcessEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
]

const salesProcessNodes: Node[] = [
  {
    id: 's1',
    type: 'input',
    data: { label: 'Lead Recebido' },
    position: { x: 150, y: 50 },
  },
  { id: 's2', data: { label: 'Qualificação' }, position: { x: 150, y: 150 } },
  {
    id: 's3',
    type: 'decision', // Using the custom decision node
    data: { label: 'Lead Qualificado?' },
    position: { x: 150, y: 250 },
  },
  {
    id: 's4',
    data: { label: 'Apresentação da Proposta' },
    position: { x: 350, y: 200 },
  },
  {
    id: 's5',
    type: 'output',
    data: { label: 'Venda Fechada' },
    position: { x: 350, y: 350 },
  },
  {
    id: 's6',
    type: 'output',
    data: { label: 'Lead Descartado' },
    position: { x: 150, y: 450 },
  },
]

const salesProcessEdges: Edge[] = [
  { id: 'es1-2', source: 's1', target: 's2', type: 'smoothstep' },
  { id: 'es2-3', source: 's2', target: 's3', type: 'smoothstep' },
  {
    id: 'es3-4',
    source: 's3',
    target: 's4',
    type: 'smoothstep',
    label: 'Sim',
  },
  { id: 'es4-5', source: 's4', target: 's5', type: 'smoothstep' },
  {
    id: 'es3-6',
    source: 's3',
    target: 's6',
    type: 'smoothstep',
    label: 'Não',
  },
]

export default function ProcessDiagramPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(exampleProcessNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(exampleProcessEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
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

  const addNode = () => {
    const newNodeId = `node_${(nodes.length + 1).toString()}`
    const newNode: Node = {
      id: newNodeId,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Nova Etapa` },
      type: 'default',
    }
    setNodes((nds) => nds.concat(newNode))
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
            <PlusCircle className='mr-2 h-4 w-4' />
            Novo Diagrama
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FolderOpen className='mr-2 h-4 w-4' />
                Abrir Diagrama
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => loadDiagram(exampleProcessNodes, exampleProcessEdges)}
              >
                Processo de Exemplo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  loadDiagram(salesProcessNodes, salesProcessEdges)
                }
              >
                Processo de Vendas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex flex-1 gap-4'>
        <div className='w-64 rounded-lg border bg-background p-4'>
            <h3 className='font-semibold mb-4'>Adicionar Nós</h3>
            <Button className='w-full' variant='outline' onClick={addNode}>
                <MousePointerSquareDashed className='mr-2 h-4 w-4' />
                Adicionar Nó de Etapa
            </Button>
        </div>
        <div className='flex-1 rounded-lg border bg-background'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant='dots' gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
