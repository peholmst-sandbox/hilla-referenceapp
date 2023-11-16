import WorkLogEntryForm from "Frontend/views/worklog/WorkLogEntryForm";
import {Button} from "@hilla/react-components/Button.js";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {useForm} from "@hilla/react-form";
import {useEffect} from "react";
import WorkLogEntryFormDTO
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTO";
import WorkLogEntryFormDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTOModel";
import {WorkLogService} from "Frontend/generated/endpoints";
import OnlineOnly from "Frontend/components/OnlineOnly";
import AuditingInformation from "Frontend/components/AuditingInformation";
import {useMutation, useQuery} from "Frontend/util/Service";
import WarningMessage from "Frontend/components/WarningMessage";
import {ProgressBar} from "@hilla/react-components/ProgressBar.js";
import ErrorMessage from "Frontend/components/ErrorMessage";
import ErrorNotification from "Frontend/components/ErrorNotification";
import {undefinedToNull} from "Frontend/util/ServiceUtils";

interface WorkLogDrawerProps {
    className?: string;
    workLogEntryId?: number;
    onCancel?: () => void;
    onSave?: (form: WorkLogEntryFormDTO) => void;
}

export default function WorkLogEntryDrawer({className, workLogEntryId, onCancel, onSave}: WorkLogDrawerProps) {
    console.debug("Rendering WorkLogEntryDrawer (workLogEntryId=" + workLogEntryId + ")");

    const QUERY_KEY = ["WorkLogEntryDrawer", workLogEntryId];
    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFunction: async () => workLogEntryId && workLogEntryId > 0 ? undefinedToNull(await WorkLogService.loadForm(workLogEntryId)) : null
    });
    const mutation = useMutation({
        queryKeysToInvalidate: [QUERY_KEY],
        mutationFunction: WorkLogService.saveForm,
        onSuccess: onSave
    });
    const isNew = query.data == undefined;

    const form = useForm(WorkLogEntryFormDTOModel, {
        onSubmit: mutation.mutateAsync
    });

    useEffect(() => {
        if (!query.data) {
            console.debug("Clearing form");
            form.clear();
        } else {
            console.debug("Reading form ", query.data);
            form.read(query.data);
        }
    }, [query.data]);

    // TODO I18N
    // TODO Prefill today's date and the current time
    // TODO Read-only support
    // TODO Prompt on unsaved changes
    // TODO Save progress management

    return (
        <VerticalLayout className={className} theme={"padding spacing"}>
            <OnlineOnly fallback={<WarningMessage message={"You have to be online to add or edit work."}/>}>
                {query.isLoading ? <ProgressBar indeterminate={true}/> : query.isSuccess ?
                    <>
                        <h1 className={"text-xl text-header"}>{isNew ? "Add Work" : "Edit Work"}</h1>
                        <WorkLogEntryForm form={form}></WorkLogEntryForm>
                        <AuditingInformation createdBy={form.value.createdBy}
                                             createdDate={form.value.createdOn}
                                             lastModifiedBy={form.value.modifiedBy}
                                             lastModifiedDate={form.value.modifiedOn}/>
                        <HorizontalLayout theme={"spacing"}>
                            <Button theme={"primary"} style={{flexGrow: 1}} onClick={form.submit}
                                    disabled={form.invalid}>{isNew ? "Add Work" : "Update Work"}</Button>
                            <Button style={{flexGrow: 1}} onClick={onCancel}>Cancel</Button>
                        </HorizontalLayout>
                        <ErrorNotification message={"Error saving work log entry"}
                                           opened={mutation.isError}
                                           onClose={mutation.reset}/>
                    </>
                    : <ErrorMessage message={"Error loading work log entry"} retry={query.refresh}/>}
            </OnlineOnly>
        </VerticalLayout>
    );
}