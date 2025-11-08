'use client'

import React, { useCallback } from 'react'
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
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
]

export default function ProcessDiagramPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-headline text-3xl font-bold'>
            Construtor de Diagramas
          </h1>
          <p className='text-muted-foreground'>
            Arraste e conecte os nós para montar seu fluxo de processo.
          </p>
        </div>
      </div>
      <div
        className='flex-1 rounded-lg border bg-background'
        style={{ height: '75vh' }}
      >
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
