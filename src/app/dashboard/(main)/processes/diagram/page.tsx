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
  useReactFlow,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  PlusCircle,
  FolderOpen,
  MousePointerSquareDashed,
  Save,
  Plus,
  Diamond,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Custom node to allow editing and quick connection
const CustomNode = ({
  id,
  data,
}: {
  id: string
  data: { label: string; onAddNode: (sourceNodeId: string) => void }
  isConnectable: boolean
}) => {
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
    <div
      onDoubleClick={handleDoubleClick}
      className='p-2 bg-background rounded-md border-2 border-stone-400'
    >
      <Handle
        type='target'
        position={Position.Top}
        className='w-16 !bg-teal-500'
      />
      {isEditing ? (
        <Input
          type='text'
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className='nodrag'
        />
      ) : (
        <div className='px-4 py-2 rounded-md'>{label}</div>
      )}
      <Handle
        type='source'
        position={Position.Bottom}
        className='w-16 !bg-teal-500'
      >
        <button
          onClick={() => data.onAddNode(id)}
          className='absolute left-1/2 -translate-x-1/2 -bottom-4 bg-primary text-white rounded-full p-0.5'
          title='Adicionar nó conectado'
        >
          <Plus size={12} />
        </button>
      </Handle>
    </div>
  )
}

const DecisionNode = ({
  id,
  data,
}: {
  id: string
  data: { label: string; onAddNode: (sourceNodeId: string) => void }
  isConnectable: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const { setNodes } = useReactFlow()

  const handleDoubleClick = () => setIsEditing(true)
  const handleBlur = () => {
    setIsEditing(false)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    )
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLabel(e.target.value)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleBlur()
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className='bg-background border-2 border-amber-500 p-4'
      style={{ transform: 'rotate(45deg)' }}
    >
      <Handle type='target' position={Position.Top} id='top' />
      <Handle type='source' position={Position.Right} id='right' />
      <Handle type='target' position={Position.Left} id='left' />
      <Handle type='source' position={Position.Bottom} id='bottom'>
        <button
          onClick={() => data.onAddNode(id)}
          className='absolute left-1/2 -translate-x-1/2 -bottom-4 bg-primary text-white rounded-full p-0.5 rotate-[-45deg]'
          title='Adicionar nó conectado'
        >
          <Plus size={12} />
        </button>
      </Handle>

      <div style={{ transform: 'rotate(-45deg)' }} className='nodrag'>
        {isEditing ? (
          <Input
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className='w-32'
            autoFocus
          />
        ) : (
          <div className='w-32 text-center'>{label}</div>
        )}
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
  decision: DecisionNode,
}

const exampleProcessNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Início do Processo' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Etapa 1' },
    position: { x: 250, y: 150 },
  },
]

const exampleProcessEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
]

function DiagramCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isNewDiagramOpen, setIsNewDiagramOpen] = useState(false)
  const [diagramName, setDiagramName] = useState('Processo de Exemplo')
  const { toast } = useToast()
  const { project } = useReactFlow()

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  )

  const addNodeFromSource = useCallback(
    (sourceNodeId: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId)
      if (!sourceNode) return

      const newNode = createNode(
        'custom',
        sourceNode.position.x,
        sourceNode.position.y + 150
      )

      const newEdge: Edge = {
        id: `e${sourceNodeId}-${newNode.id}`,
        source: sourceNodeId,
        target: newNode.id,
        type: 'smoothstep',
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [nodes, project, setNodes, setEdges]
  )

  const createNode = useCallback(
    (type: 'custom' | 'decision', x: number, y: number) => {
      const newNodeId = `node_${Date.now()}`
      const newNode: Node = {
        id: newNodeId,
        type,
        position: project({ x, y }),
        data: {
          label: type === 'decision' ? 'Decisão' : `Nova Etapa`,
          onAddNode: addNodeFromSource,
        },
      }
      setNodes((nds) => nds.concat(newNode))
      return newNode
    },
    [project, setNodes, addNodeFromSource]
  )

  React.useEffect(() => {
    const initialNodesWithCallback = exampleProcessNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onAddNode: addNodeFromSource,
      },
    }))
    setNodes(initialNodesWithCallback)
    setEdges(exampleProcessEdges)
  }, []) // Empty dependency array to run only once on mount

  const handleNewDiagram = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newName = formData.get('diagram-name') as string
    setDiagramName(newName || 'Diagrama sem nome')
    setNodes([])
    setEdges([])
    setIsNewDiagramOpen(false)
  }

  const loadDiagram = (newNodes: Node[], newEdges: Edge[], name: string) => {
    const nodesWithCallback = newNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onAddNode: addNodeFromSource,
      },
    }))
    setNodes(nodesWithCallback)
    setEdges(newEdges)
    setDiagramName(name)
  }

  const addNode = (type: 'custom' | 'decision') => {
    createNode(type, Math.random() * 200 + 100, Math.random() * 200)
  }

  const handleSave = () => {
    toast({
      title: 'Diagrama Salvo!',
      description: `O diagrama "${diagramName}" foi salvo com sucesso.`,
    })
  }

  return (
    <div className='flex h-[calc(100vh-10rem)] flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-headline text-3xl font-bold'>{diagramName}</h1>
          <p className='text-muted-foreground'>
            Dê um duplo clique em um nó para editar seu título.
          </p>
        </div>
        <div className='flex gap-2'>
          <Dialog open={isNewDiagramOpen} onOpenChange={setIsNewDiagramOpen}>
            <DialogTrigger asChild>
              <Button variant='outline'>
                <PlusCircle className='mr-2 h-4 w-4' />
                Novo Diagrama
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <form onSubmit={handleNewDiagram}>
                <DialogHeader>
                  <DialogTitle>Criar Novo Diagrama</DialogTitle>
                  <DialogDescription>
                    Dê um nome ao seu novo diagrama de processo.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <Label htmlFor='diagram-name'>Nome do Diagrama</Label>
                  <Input
                    id='diagram-name'
                    name='diagram-name'
                    placeholder='Ex: Processo de Onboarding'
                  />
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsNewDiagramOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>Criar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FolderOpen className='mr-2 h-4 w-4' />
                Abrir Exemplo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  loadDiagram(
                    exampleProcessNodes,
                    exampleProcessEdges,
                    'Processo de Exemplo'
                  )
                }
              >
                Processo Simples
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='default' onClick={handleSave}>
            <Save className='mr-2 h-4 w-4' />
            Salvar
          </Button>
        </div>
      </div>
      <div className='flex flex-1 gap-4'>
        <div className='w-64 rounded-lg border bg-background p-4 space-y-4'>
          <h3 className='font-semibold'>Adicionar Nós</h3>
          <Button
            className='w-full'
            variant='outline'
            onClick={() => addNode('custom')}
          >
            <MousePointerSquareDashed className='mr-2 h-4 w-4' />
            Adicionar Nó de Etapa
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onClick={() => addNode('decision')}
          >
            <Diamond className='mr-2 h-4 w-4' />
            Adicionar Nó de Decisão
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

export default function ProcessDiagramPage() {
  return (
    <ReactFlowProvider>
      <DiagramCanvas />
    </ReactFlowProvider>
  )
}
