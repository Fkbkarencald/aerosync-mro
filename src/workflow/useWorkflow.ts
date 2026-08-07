import { useContext } from 'react'
import { WorkflowContext, type WorkflowContextValue } from './context'

export function useWorkflow(): WorkflowContextValue {
  const value = useContext(WorkflowContext)
  if (!value) throw new Error('useWorkflow must be used inside WorkflowProvider')
  return value
}
