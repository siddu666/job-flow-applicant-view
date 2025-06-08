
import { Profile } from './Profile'

export interface UseAllCandidatesResult {
  data?: Profile[]
  isLoading: boolean
  error: Error | null
  isError: boolean
}
