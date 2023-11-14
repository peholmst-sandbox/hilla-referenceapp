import {
    useMutation as useMutation_1,
    useQuery as useQuery_1,
    useQueryClient as useQueryClient_1
} from "@tanstack/react-query";

export type QueryResult<T> = {
    data: T | undefined;
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    refresh: () => Promise<void>;
};

export type QueryKey = any | any[]

function toQueryKey(key: QueryKey): any[] {
    return Array.isArray(key) ? key : [key];
}

export type QueryOptions<T> = {
    queryKey: QueryKey;
    queryFunction: () => Promise<T>;
}

export function useQuery<T>(options: QueryOptions<T>): QueryResult<T> {
    const queryClient = useQueryClient_1();
    const o = {
        queryKey: toQueryKey(options.queryKey),
        queryFn: options.queryFunction
    };
    const {data, isSuccess, isError, isLoading} = useQuery_1(o);
    return {
        data: data,
        isSuccess: isSuccess,
        isError: isError,
        isLoading: isLoading,
        refresh: async () => await queryClient.refetchQueries(o)
    };
}

export type MutationResult<T> = {
    data: T | undefined;
    isSuccess: boolean;
    isError: boolean;
    isPending: boolean;
    mutate: (data: T) => void;
    mutateAsync: (data: T) => Promise<T>;
    reset: () => void;
};

export type MutationOptions<T> = {
    queryKeysToInvalidate?: QueryKey[];
    queryKeysToRefresh?: string[];
    mutationFunction: (data: T) => Promise<T>;
};

export function useMutation<T>(options: MutationOptions<T>): MutationResult<T> {
    const queryClient = useQueryClient_1();
    const refresh = async () => {
        console.debug("Refreshing queries");
        if (options.queryKeysToInvalidate) {
            for (const key of options.queryKeysToInvalidate) {
                await queryClient.invalidateQueries({queryKey: toQueryKey(key)});
            }
        }
        if (options.queryKeysToRefresh) {
            for (const key of options.queryKeysToRefresh) {
                await queryClient.refetchQueries({queryKey: toQueryKey(key)});
            }
        }
    };
    const cancelQueries = async () => {
        console.debug("Canceling queries");
        if (options.queryKeysToInvalidate) {
            for (const key of options.queryKeysToInvalidate) {
                await queryClient.cancelQueries({queryKey: toQueryKey(key)});
            }
        }
        if (options.queryKeysToRefresh) {
            for (const key of options.queryKeysToRefresh) {
                await queryClient.cancelQueries({queryKey: toQueryKey(key)});
            }
        }
    }
    const {isSuccess, isError, isPending, data, mutate, mutateAsync, reset} = useMutation_1({
        mutationFn: options.mutationFunction,
        onMutate: cancelQueries,
        onSettled: refresh
    });
    return {
        data: data,
        isSuccess: isSuccess,
        isError: isError,
        isPending: isPending,
        mutate: mutate,
        mutateAsync: mutateAsync,
        reset: reset
    };
}