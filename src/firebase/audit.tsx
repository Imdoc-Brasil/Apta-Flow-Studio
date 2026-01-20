'use client';

import { collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { addDocumentNonBlocking } from './non-blocking-updates';

export interface AuditLog {
    id?: string;
    userId: string;
    userEmail: string;
    userName?: string;
    action: string;
    module: string;
    entityId: string;
    entityName?: string;
    details?: any;
    timestamp: any;
}

/**
 * Cria um log de auditoria na coleção 'audit_logs'.
 * Esta função é non-blocking e não lança erros se falhar (apenas loga no console via interceptor se houver erro de permissão).
 */
export function createAuditLog(
    firestore: Firestore,
    log: Omit<AuditLog, 'timestamp'>
) {
    if (!firestore) return;

    const auditRef = collection(firestore, 'audit_logs');
    const fullLog = {
        ...log,
        timestamp: serverTimestamp(),
    };

    return addDocumentNonBlocking(auditRef, fullLog);
}
