import {GridDataProvider, GridDataProviderCallback, GridDataProviderParams} from "@hilla/react-components/Grid";
import Pageable from "Frontend/generated/dev/hilla/mappedtypes/Pageable";
import {useMemo} from "react";
import {gridDataProviderParamsToPageable} from "Frontend/util/GridUtils";

export type QueryFunction<T> = (pageable: Pageable) => Promise<{ items: T[], count: number }>;

export type DataProviderOptions<T> = {
    queryFunction: QueryFunction<T>;
    deps: any[];
    errorHandler?: (error: any) => void;
}

export function useDataProvider<T>(options: DataProviderOptions<T>): GridDataProvider<T> {
    return useMemo(() =>
            async (params: GridDataProviderParams<T>,
                   callback: GridDataProviderCallback<T>) => {
                try {
                    const {
                        items,
                        count
                    } = await options.queryFunction(gridDataProviderParamsToPageable(params));
                    callback(items, count);
                } catch (error) {
                    options.errorHandler ? options.errorHandler(error) : console.error(error);
                }
            },
        [...options.deps]);
}