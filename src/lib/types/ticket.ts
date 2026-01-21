export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  completedBy?: string;
  completedAt?: string;
  assignedTo?: string[];
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  creator: string;
  creatorAvatar?: string;
  creatorFallback?: string;
  createdAt: string;
}

export interface TextElement {
  id: string;
  type: "note" | "question" | "comment";
  title: string;
  content: string;
  creator: string;
  creatorAvatar?: string;
  creatorFallback?: string;
  createdAt: string;
  dueDate?: string;
  assignedTo?: string[];
}

export type TicketStatus = "Aberto" | "Em Progresso" | "Resolvido" | "Fechado" | "Arquivado";

export type Ticket = {
  id: string;
  subject: string;
  client: string;
  priority: "Alta" | "Média" | "Baixa";
  status: TicketStatus;
  updated: string;
  createdAt: string;
  description?: string;
  assignedTo?: string[];
  labels?: Label[];
  checklists?: Checklist[];
  attachments?: Attachment[];
  textElements?: TextElement[];
  relatedEmployee?: string;
  solicitationType?: string; // Added for health requests
};
