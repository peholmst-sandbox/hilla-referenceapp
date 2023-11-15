import {FormLayout} from "@hilla/react-components/FormLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TextArea} from "@hilla/react-components/TextArea";
import {DatePicker} from "@hilla/react-components/DatePicker";
import {TimePicker} from "@hilla/react-components/TimePicker";
import {useFormPart, UseFormPartResult, UseFormResult} from "@hilla/react-form";
import {useEffect, useState} from "react";
import {useErrorHandler} from "Frontend/util/ErrorHandler";
import {NotBlank, NotNull} from "@hilla/form";
import {LocalTime} from "Frontend/types/LocalTime";
import {Duration} from "Frontend/types/Duration";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {formatDuration} from "Frontend/i18n/DurationFormatter";
import WorkLogEntryFormDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTOModel";
import {ReferenceLookupService, WorkLogService} from "Frontend/generated/endpoints";
import {useParameterizedQuery, useQuery} from "Frontend/util/Service";
import ErrorNotification from "Frontend/components/ErrorNotification";

interface TimeEntryFormProps {
    form: UseFormResult<WorkLogEntryFormDTOModel>;
}

function clearValueIfNotInList<T>(field: UseFormPartResult<any>, expectedValue: T | undefined, list: T[] | undefined, idExtractor: (item: T) => any) {
    if (expectedValue && list) {
        const expectedId = idExtractor(expectedValue);
        if (!list.find((item) => idExtractor(item) === expectedId)) {
            field.setValue(undefined);
        }
    }
}

export default function WorkLogEntryForm({form}: TimeEntryFormProps) {
    console.debug("Rendering WorkLogEntryForm");
    const errorHandler = useErrorHandler();
    const {model, value, field} = form;

    const projects = useQuery({
        queryKey: "WorkLogEntryFormProjects",
        queryFunction: ReferenceLookupService.findProjects
    });
    const contracts = useParameterizedQuery({
        queryKey: "WorkLogEntryFormContracts",
        queryFunction: ReferenceLookupService.findContractsByProject,
        parameter: value.project,
        defaultResult: []
    });
    const hourCategories = useParameterizedQuery({
        queryKey: "WorkLogEntryFormHourCategories",
        queryFunction: ReferenceLookupService.findHourCategoriesByContract,
        parameter: value.contract,
        defaultResult: []
    });

    const [contractHelper, setContractHelper] = useState("");
    const [hourCategoryHelper, setHourCategoryHelper] = useState("");
    const [endTimeHelper, setEndTimeHelper] = useState("");
    const [durationHelper, setDurationHelper] = useState("");

    const responsiveSteps = [
        {minWidth: '0', columns: 1},
        {minWidth: '320px', columns: 2},
        {minWidth: '500px', columns: 4},
    ];

    const projectField = useFormPart(model.project);
    const contractField = useFormPart(model.contract);
    const dateField = useFormPart(model.date);
    const startTimeField = useFormPart(model.startTime);
    const endTimeField = useFormPart(model.endTime);
    const hourCategoryField = useFormPart(model.hourCategory);

    useEffect(() => {
        projectField.addValidator(new NotNull({message: "Please select a project."}));
        contractField.addValidator(new NotNull({message: "Please add a contract."}));
        dateField.addValidator(new NotBlank({message: "Please select a date."}));
        startTimeField.addValidator(new NotBlank({message: "Please enter a start time."}));
        endTimeField.addValidator(new NotBlank({message: "Please enter an end time."}));
        hourCategoryField.addValidator(new NotNull({message: "Please select an hour category."}));
    }, []);

    useEffect(() => {
        setContractHelper(value.project ? "" : "You have to select a project before you can select a contract.");
    }, [value.project]);

    useEffect(() => {
        setHourCategoryHelper(value.contract ? "" : "You have to select a contract before you can select an hour category.");
    }, [value.contract]);

    useEffect(() => {
        clearValueIfNotInList(projectField, value.project, projects.data, item => item.id);
    }, [projects.data]);

    useEffect(() => {
        clearValueIfNotInList(contractField, value.contract, contracts.data, item => item.id);
    }, [contracts.data]);

    useEffect(() => {
        clearValueIfNotInList(hourCategoryField, value.hourCategory, hourCategories.data, item => item.id);
    }, [hourCategories.data]);

    useEffect(() => {
        if (value.date && value.startTime && value.endTime) {
            if (!LocalTime.parseString(value.startTime).isBefore(LocalTime.parseString(value.endTime))) {
                setEndTimeHelper("The end time is on the next day.");
            } else {
                setEndTimeHelper("");
            }
            // We're asking the server for the duration to be able to account for daylight savings time changes
            WorkLogService.calculateDurationInSecondsBetween(value.date, value.startTime, value.endTime) // TODO Create a suitable hook for this use case in Service.tsx
                .then((durationInSeconds) => {
                    const duration = Duration.ofSeconds(durationInSeconds);
                    setDurationHelper("This entry contains " + formatDuration(duration) + " of work.");
                })
                .catch((error) => errorHandler.handleTechnicalError(error, "An error occurred while calculating the work duration"));
        } else {
            setDurationHelper("");
            setEndTimeHelper("");
        }
    }, [value.date, value.startTime, value.endTime]);

    return (
        <FormLayout responsiveSteps={responsiveSteps}>
            <ComboBox
                {...{colspan: 2}}
                {...field(model.project)}
                label={"Project"}
                items={projects.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}/>
            <ErrorNotification message={"Error loading projects"} opened={projects.isError} retry={projects.refresh}/>
            <ComboBox
                {...{colspan: 2}}
                {...field(model.contract)}
                label={"Contract"}
                helperText={contractHelper}
                items={contracts.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}
            />
            <ErrorNotification message={"Error loading contracts"} opened={contracts.isError}
                               retry={contracts.refresh}/>
            <DatePicker
                {...{colspan: 2}}
                {...field(model.date)}
                label={"Date"}/>
            <TimePicker
                {...field(model.startTime)}
                label={"Start time"}/>
            <TimePicker
                {...field(model.endTime)}
                label={"End time"}
                helperText={endTimeHelper}/>
            <HorizontalLayout {...{colspan: 4}}>
                <span className={"text-xs text-secondary"}>{durationHelper}</span>
            </HorizontalLayout>
            <TextArea
                {...{colspan: 4}}
                {...field(model.description)}
                label={"Description"}/>
            <ComboBox
                {...{colspan: 4}}
                {...field(model.hourCategory)}
                label={"Category"}
                helperText={hourCategoryHelper}
                items={hourCategories.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}/>
            <ErrorNotification message={"Error loading hour categories"} opened={hourCategories.isError}
                               retry={hourCategories.refresh}/>
        </FormLayout>
    )
}