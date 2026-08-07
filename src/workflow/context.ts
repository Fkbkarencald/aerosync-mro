import { createContext } from 'react'
import type { CreateWorkOrderInput, SignOffInput, WorkflowState } from './engine'

export interface WorkflowContextValue {
  state: WorkflowState
  startReview: (defectId: string, actorId: string) => void
  createWorkOrder: (input: CreateWorkOrderInput) => string
  beginWork: (workOrderId: string, actorId: string) => void
  completeTask: (workOrderId: string, taskSeq: number, actorId: string) => void
  signOff: (input: SignOffInput) => { signOffId: string; maintenanceRecordId: string }
  reset: () => void
}

export const WorkflowContext = createContext<WorkflowContextValue | null>(null)
