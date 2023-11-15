import {ProjectAdminService} from "Frontend/generated/endpoints";
import {useMutation, useQuery} from "Frontend/util/Service";
import OnlineOnly from "Frontend/components/OnlineOnly";
import WarningMessage from "Frontend/components/WarningMessage";
import {ProgressBar} from "@hilla/react-components/ProgressBar.js";
import ErrorMessage from "Frontend/components/ErrorMessage";
import {Crud} from "@hilla/react-components/Crud";
import ErrorNotification from "Frontend/components/ErrorNotification";

export default function ProjectAdminView() {
    console.debug("Rendering ProjectAdminView");

    const QUERY_KEY = "project-admin-view";
    const queryOptions = {
        queryKey: QUERY_KEY,
        queryFunction: ProjectAdminService.findAll
    };
    const mutationOptions = {
        queryKeysToRefresh: [QUERY_KEY],
        mutationFunction: ProjectAdminService.save
    }

    const query = useQuery(queryOptions);
    const mutation = useMutation(mutationOptions);

    return (
        <OnlineOnly fallback={<WarningMessage message={"Project administration is not available offline."}/>}>
            {query.isLoading ? <ProgressBar indeterminate={true}/> : query.isSuccess ?
                <>
                    <Crud include={"name"}
                          items={query.data}
                          className={"h-full"}
                          onSave={event => mutation.mutate(event.detail.item)}
                    />
                    <ErrorNotification message={"Error saving project"}
                                       opened={mutation.isError}
                                       onClose={mutation.reset}/>
                </>
                : <ErrorMessage message={"Error loading projects"} retry={query.refresh}/>}
        </OnlineOnly>
    );
}