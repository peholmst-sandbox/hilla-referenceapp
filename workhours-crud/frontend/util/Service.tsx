import {
    useMutation as useMutation_1,
    useQuery as useQuery_1,
    useQueryClient as useQueryClient_1
} from "@tanstack/react-query";

// TODO There is some code duplication in this file. Refactor!

type QueryResult<T> = {
    readonly data: T | undefined;
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly isLoading: boolean;
    readonly refresh: () => Promise<void>;
};

type QueryKey = any | any[]

function toQueryKey(key: QueryKey): any[] {
    return Array.isArray(key) ? key : [key];
}

type QueryOptions<T> = {
    queryKey: QueryKey;
    queryFunction: () => Promise<T>;
}

export function useQuery<T>(options: QueryOptions<T>): QueryResult<T> {
    const TAG = "useQuery";
    const queryClient = useQueryClient_1();
    const queryFn = () => {
        console.debug(TAG, options.queryKey, "Invoking query function");
        return options.queryFunction();
    };
    const o = {
        queryKey: toQueryKey(options.queryKey),
        queryFn: queryFn
    };
    const refresh = async () => {
        console.debug(TAG, options.queryKey, "Refreshing query");
        await queryClient.refetchQueries(o);
    };
    const {data, isSuccess, isError, isLoading} = useQuery_1(o);
    return {
        data: data,
        isSuccess: isSuccess,
        isError: isError,
        isLoading: isLoading,
        refresh: refresh
    };
}

type MutationResult<T> = {
    readonly data: T | undefined;
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly isPending: boolean;
    readonly mutate: (data: T) => void;
    readonly mutateAsync: (data: T) => Promise<T>;
    readonly reset: () => void;
};

type MutationOptions<T> = {
    queryKeysToInvalidate?: QueryKey[];
    queryKeysToRefresh?: string[];
    mutationFunction: (data: T) => Promise<T>;
    onSuccess?: (data: T) => unknown;
};

export function useMutation<T>(options: MutationOptions<T>): MutationResult<T> {
    const TAG = "useMutation";
    const queryClient = useQueryClient_1();
    const refresh = async () => {
        if (options.queryKeysToInvalidate) {
            for (const key of options.queryKeysToInvalidate) {
                console.debug(TAG, "Invalidating query", key);
                await queryClient.invalidateQueries({queryKey: toQueryKey(key)});
            }
        }
        if (options.queryKeysToRefresh) {
            for (const key of options.queryKeysToRefresh) {
                console.debug(TAG, "Refreshing query", key);
                await queryClient.refetchQueries({queryKey: toQueryKey(key)});
            }
        }
    };
    const cancelQueries = async () => {
        const queryKeysToCancel = [...options.queryKeysToInvalidate ?? [], ...options.queryKeysToRefresh ?? []];
        for (const key of queryKeysToCancel) {
            console.debug(TAG, "Canceling query", key);
            await queryClient.cancelQueries({queryKey: toQueryKey(key)});
        }
    }
    const {isSuccess, isError, isPending, data, mutate, mutateAsync, reset} = useMutation_1({
        mutationFn: (data: T) => {
            console.debug(TAG, "Invoking mutation function with input", data);
            return options.mutationFunction(data);
        },
        onMutate: cancelQueries,
        onSettled: refresh,
        onSuccess: options.onSuccess
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

type ParameterizedQueryOptions<T, P extends Array<any>> = {
    queryKey: QueryKey;
    queryFunction: (...params: P) => Promise<T>;
    params: P;
};

export function useParameterizedQuery<T, P extends Array<any>>(options: ParameterizedQueryOptions<T, P>): QueryResult<T> {
    const TAG = "useParameterizedQuery";
    const queryClient = useQueryClient_1();
    const queryFn = () => {
        console.debug(TAG, options.queryKey, "Invoking query function with params", options.params);
        return options.queryFunction(...options.params)
    };
    const o = {
        queryKey: [...toQueryKey(options.queryKey), ...options.params],
        queryFn: queryFn
    };
    const refresh = async () => {
        console.debug(TAG, options.queryKey, "Refreshing query");
        await queryClient.refetchQueries(o);
    };
    const {data, isSuccess, isError, isLoading} = useQuery_1(o);
    return {
        data: data,
        isSuccess: isSuccess,
        isError: isError,
        isLoading: isLoading,
        refresh: refresh
    };
}