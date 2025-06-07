
// interfaces/UseAllCandidatesResult.ts

import {Profile} from "@/interfaces/Profile";

export type UseAllCandidatesResult = {
    data: Profile[];
    total: number;
    isLoading: boolean;
    error?: Error;
};

