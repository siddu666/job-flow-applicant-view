// interfaces/UseAllCandidatesResult.ts
import { Profile } from '../hooks/useProfile';

export type UseAllCandidatesResult =  {
    data: Profile[];
    total: number;
};
