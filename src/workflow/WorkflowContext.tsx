import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  WORKFLOW_STORAGE_KEY,
  completeWorkOrderTask,
  createInitialWorkflowState,
  createWorkOrderFromDefect,
  restoreWorkflowState,
  signOffWorkOrder,
  startDefectReview,
  startWork,
  type WorkflowState,
} from './engine'
import { WorkflowContext } from './context'
import type { CreateWorkOrderInput, SignOffInput } from './engine'

const loadInitialState = (): WorkflowState =>
  typeof window === 'undefined'
    ? createInitialWorkflowState()
    : restoreWorkflowState(window.localStorage.getItem(WORKFLOW_STORAGE_KEY))

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(loadInitialState)

  useEffect(() => {
    window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const startReview = useCallback((defectId: string, actorId: string) => {
    setState((current) => startDefectReview(current, defectId, actorId))
  }, [])

  const createWorkOrder = useCallback((input: CreateWorkOrderInput): string => {
    const result = createWorkOrderFromDefect(state, input)
    setState(result.state)
    return result.workOrderId
  }, [state])

  const beginWork = useCallback((workOrderId: string, actorId: string) => {
    setState((current) => startWork(current, workOrderId, actorId))
  }, [])

  const completeTask = useCallback((workOrderId: string, taskSeq: number, actorId: string) => {
    setState((current) => completeWorkOrderTask(current, workOrderId, taskSeq, actorId))
  }, [])

  const signOff = useCallback((input: SignOffInput) => {
    const result = signOffWorkOrder(state, input)
    setState(result.state)
    return { signOffId: result.signOffId, maintenanceRecordId: result.maintenanceRecordId }
  }, [state])

  const reset = useCallback(() => setState(createInitialWorkflowState()), [])

  const value = useMemo(
    () => ({ state, startReview, createWorkOrder, beginWork, completeTask, signOff, reset }),
    [state, startReview, createWorkOrder, beginWork, completeTask, signOff, reset],
  )

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}
