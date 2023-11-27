import {useEffect, useState} from "react";

// TODO There is some code duplication in this file. Refactor!

export type UseServiceStatus = "idle" | "pending" | "success" | "error";

export type UseServiceBaseResult<R> = {
    readonly isIdle: boolean;
    readonly isPending: boolean;
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly status: UseServiceStatus;
    readonly data: R | undefined;
    readonly error: any | undefined;
    readonly reset: () => void;
}

export type UseServiceQueryResult<R> = UseServiceBaseResult<R> & {
    readonly retry: () => void;
}

export type UseServiceBaseOptions<A extends Array<any>, R> = {
    serviceFunction: (...args: A) => Promise<R>;
    fallbackResult?: R;
    onSuccess?: (data: R) => void;
    onError?: (error: any) => void;
    onDone?: (data: R | undefined, error: any | undefined) => void;
}

export type UseServiceQueryOptions<A extends Array<any>, R> = UseServiceBaseOptions<A, R> & {
    params: A;
}

export function useServiceQuery<A extends Array<any>, R>(options: UseServiceQueryOptions<A, R>): UseServiceQueryResult<R> {
    const [status, setStatus] = useState<UseServiceStatus>("idle");
    const [error, setError] = useState();
    const [data, setData] = useState<R>();
    const [retryTrigger, setRetryTrigger] = useState(0);

    let cancelled = false;

    useEffect(() => {
        console.debug("useServiceQuery", options, "Calling service function");
        setStatus("pending");
        setData(undefined);
        setError(undefined);

        cancelled = false;
        options
            .serviceFunction(...options.params)
            .then(result => {
                if (!cancelled) {
                    console.debug("useServiceQuery", options, "Function returned", result);
                    setData(result);
                    setStatus("success");
                    if (options.onSuccess) {
                        options.onSuccess(result);
                    }
                    if (options.onDone) {
                        options.onDone(result, undefined);
                    }
                }
            })
            .catch(error => {
                if (!cancelled) {
                    console.error("useServiceQuery", options, "Error while calling service function", error);
                    setError(error);
                    setStatus("error");
                    if (options.fallbackResult !== undefined) {
                        setData(options.fallbackResult);
                    }
                    if (options.onError) {
                        options.onError(error);
                    }
                    if (options.onDone) {
                        options.onDone(undefined, error);
                    }
                }
            });
        return () => {
            cancelled = true;
        };
    }, [...options.params, retryTrigger]);

    return {
        isIdle: status === "idle",
        isPending: status === "pending",
        isSuccess: status === "success",
        isError: status === "error",
        status: status,
        data: data,
        error: error,
        retry: () => setRetryTrigger(Math.random()),
        reset: () => {
            console.debug("useServiceQuery", options, "Resetting");
            setStatus("idle");
            setData(undefined);
            setError(undefined);
        }
    };
}

export type UseServiceCallResult<A extends Array<any>, R> = UseServiceBaseResult<R> & {
    call: (...args: A) => void;
    callAsync: (...args: A) => Promise<void>;
}

export type UseServiceCallOptions<A extends Array<any>, R> = UseServiceBaseOptions<A, R>;

export function useServiceCall<A extends Array<any>, R>(options: UseServiceCallOptions<A, R>): UseServiceCallResult<A, R> {
    const [status, setStatus] = useState<UseServiceStatus>("idle");
    const [error, setError] = useState<any>();
    const [data, setData] = useState<R>();

    const callAsync = async (...args: A) => {
        console.debug("useServiceCall", options, "Calling function with args", args);
        setStatus("pending");
        setData(undefined);
        setError(undefined);
        try {
            const result = await options.serviceFunction(...args);
            console.debug("useServiceCall", options, "Function returned", result);
            setData(result);
            setStatus("success");
            if (options.onSuccess) {
                options.onSuccess(result);
            }
            if (options.onDone) {
                options.onDone(result, undefined);
            }
        } catch (error) {
            console.error("useServiceCall", options, "Error while calling function with args", args, error);
            setError(error);
            setStatus("error");
            if (options.onError) {
                options.onError(error);
            }
            if (options.onDone) {
                options.onDone(undefined, error);
            }
            throw error;
        }
    };

    return {
        isIdle: status === "idle",
        isPending: status === "pending",
        isSuccess: status === "success",
        isError: status === "error",
        status: status,
        data: data,
        error: error,
        call: (...args: A) => {
            callAsync(...args).then(() => {
            }, () => {
            });
        },
        callAsync: callAsync,
        reset: () => {
            console.debug("useServiceCall", options, "Resetting");
            setStatus("idle");
            setData(undefined);
            setError(undefined);
        }
    };
}