import {ContractAdminService, ReferenceLookupService} from "Frontend/generated/endpoints";
import {useMutation, useQuery} from "Frontend/util/Service";
import OnlineOnly from "Frontend/components/OnlineOnly";
import WarningMessage from "Frontend/components/WarningMessage";
import {ProgressBar} from "@hilla/react-components/ProgressBar.js";
import ErrorMessage from "Frontend/components/ErrorMessage";
import {Crud, crudPath} from "@hilla/react-components/Crud";
import ErrorNotification from "Frontend/components/ErrorNotification";
import {FormLayout} from "@hilla/react-components/FormLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TextField} from "@hilla/react-components/TextField";
import {MultiSelectComboBox} from "@hilla/react-components/MultiSelectComboBox";

export default function ContractAdminView() {
    console.debug("Rendering ContractAdminView");

    const QUERY_KEY = "contract-admin-view";
    const queryOptions = {
        queryKey: QUERY_KEY,
        queryFunction: ContractAdminService.findAll
    };
    const mutationOptions = {
        queryKeysToRefresh: [QUERY_KEY],
        mutationFunction: ContractAdminService.save
    };

    const query = useQuery(queryOptions);
    const mutation = useMutation(mutationOptions);

    const projects = useQuery({
        queryKey: "projects",
        queryFunction: ReferenceLookupService.findProjects
    });
    const hourCategories = useQuery({
        queryKey: "hourCategories",
        queryFunction: ReferenceLookupService.findHourCategories
    });

    // TODO The ComboBox and MultiSelectComboBox are not working properly here.

    return (
        <OnlineOnly fallback={<WarningMessage message={"Contract administration is not available offline."}/>}>
            {query.isLoading ? <ProgressBar indeterminate={true}/> : query.isSuccess ?
                <>
                    <Crud include={"project, name, allowedHourCategories"}
                          items={query.data}
                          className={"h-full"}
                          onSave={event => mutation.mutate(event.detail.item)}
                    >
                        <FormLayout slot={"form"}>
                            <ComboBox label={"Project"}
                                      items={projects.data}
                                      itemLabelPath={"name"}
                                      itemIdPath={"id"}
                                      {...crudPath("project")}
                                      required/>
                            <TextField label={"Contract Name"}
                                       {...crudPath("name")}
                                       required/>
                            <MultiSelectComboBox label={"Allowed Hour Categories"}
                                                 items={hourCategories.data}
                                                 itemLabelPath={"name"}
                                                 itemIdPath={"id"}
                                                 {...crudPath("allowedHourCategories")}/>
                        </FormLayout>
                    </Crud>
                    <ErrorNotification message={"Error saving contract"}
                                       opened={mutation.isError}
                                       onClose={mutation.reset}/>
                </>
                : <ErrorMessage message={"Error loading contracts"} retry={query.refresh}/>}
        </OnlineOnly>
    );
}