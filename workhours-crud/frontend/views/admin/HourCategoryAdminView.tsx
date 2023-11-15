import {Crud} from "@hilla/react-components/Crud";
import {HourCategoryAdminService} from "Frontend/generated/endpoints";
import {ProgressBar} from "@hilla/react-components/ProgressBar.js";
import ErrorMessage from "Frontend/components/ErrorMessage";
import {useMutation, useQuery} from "Frontend/util/Service";
import WarningMessage from "Frontend/components/WarningMessage";
import React from "react";
import OnlineOnly from "Frontend/components/OnlineOnly";
import ErrorNotification from "Frontend/components/ErrorNotification";

export default function HourCategoryAdminView() {
    console.debug("Rendering HourCategoryAdminView");

    const QUERY_KEY = "hour-category-admin-view";
    const queryOptions = {
        queryKey: QUERY_KEY,
        queryFunction: HourCategoryAdminService.findAll
    };
    const mutationOptions = {
        queryKeysToRefresh: [QUERY_KEY],
        mutationFunction: HourCategoryAdminService.save
    }

    const query = useQuery(queryOptions);
    const mutation = useMutation(mutationOptions);

    return (
        <OnlineOnly fallback={<WarningMessage message={"Hour category administration is not available offline."}/>}>
            {query.isLoading ? <ProgressBar indeterminate={true}/> : query.isSuccess ?
                <>
                    <Crud include={"name"}
                          items={query.data}
                          className={"h-full"}
                          onSave={event => mutation.mutate(event.detail.item)}
                    />
                    <ErrorNotification message={"Error saving hour category"}
                                       opened={mutation.isError}
                                       onClose={mutation.reset}/>
                </>
                : <ErrorMessage message={"Error loading hour categories"} retry={query.refresh}/>}
        </OnlineOnly>
    );
}
