
// interfaces/UseAllCandidatesResult.ts

export type UseAllCandidatesResult = {
    data: Profile[];
    total: number;
    isLoading: boolean;
    error?: Error;
};

