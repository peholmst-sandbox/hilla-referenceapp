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
import {undefinedResultToNull, useMutation, useParameterizedQuery} from "Frontend/util/Service";
import WarningMessage from "Frontend/components/WarningMessage";

interface WorkLogDrawerProps {
    className?: string;
    workLogEntryId?: number;
    onCancel?: () => void;
    onSave?: (form: WorkLogEntryFormDTO) => void;
}

function negativeToUndefined(value: number | undefined): number | undefined {
    return value !== undefined && value < 0 ? undefined : value;
}

export default function WorkLogEntryDrawer({className, workLogEntryId, onCancel, onSave}: WorkLogDrawerProps) {
    console.debug("Rendering WorkLogEntryDrawer");

    const QUERY_KEY = "work-log-entry-drawer";
    const query = useParameterizedQuery({
        queryKey: QUERY_KEY,
        parameter: negativeToUndefined(workLogEntryId), // TODO This is so ugly!
        queryFunction: undefinedResultToNull(WorkLogService.loadForm),
        defaultResult: null
    });
    const mutation = useMutation({
        queryKeysToRefresh: ["work-log-view"],
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
            console.debug("Reading form");
            form.read(query.data);
        }
    }, [query.data]);

    // TODO I18N
    // TODO Prefill today's date and the current time
    // TODO Read-only support
    // TODO Prompt on unsaved changes
    // TODO Loading and error management!

    return (
        <VerticalLayout className={className} theme={"padding spacing"}>
            <OnlineOnly fallback={<WarningMessage message={"You have to be online to add or edit work."}/>}>
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
            </OnlineOnly>
        </VerticalLayout>
    );
}