import {FormLayout} from "@hilla/react-components/FormLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TextArea} from "@hilla/react-components/TextArea";
import {DatePicker} from "@hilla/react-components/DatePicker";
import {TimePicker} from "@hilla/react-components/TimePicker";
import {useFormPart, UseFormPartResult, UseFormResult} from "@hilla/react-form";
import {useEffect, useState} from "react";
import {NotBlank, NotNull} from "@hilla/form";
import {LocalTime} from "Frontend/types/LocalTime";
import {Duration} from "Frontend/types/Duration";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {formatDuration} from "Frontend/i18n/DurationFormatter";
import WorkLogEntryFormDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTOModel";
import {ReferenceLookupService, WorkLogService} from "Frontend/generated/endpoints";
import {useServiceQuery} from "Frontend/util/Service";
import ErrorNotification from "Frontend/components/ErrorNotification";
import ProjectReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ProjectReference";
import ContractReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ContractReference";

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
    const {model, value, field} = form;

    const projects = useServiceQuery({
        serviceFunction: ReferenceLookupService.findProjects,
        params: []
    });
    const contracts = useServiceQuery({
        serviceFunction: async (project?: ProjectReference) => project ? await ReferenceLookupService.findContractsByProject(project) : [],
        params: [value.project]
    });
    const hourCategories = useServiceQuery({
        serviceFunction: async (contract?: ContractReference) => contract ? await ReferenceLookupService.findHourCategoriesByContract(contract) : [],
        params: [value.contract]
    });
    const durationHelper = useServiceQuery({
        serviceFunction: async (date?: string, startTime?: string, endTime?: string) => {
            if (date && startTime && endTime) {
                const durationInSeconds = await WorkLogService.calculateDurationInSecondsBetween(date, startTime, endTime);
                const duration = Duration.ofSeconds(durationInSeconds);
                return "This entry contains " + formatDuration(duration) + " of work.";
            } else {
                return "";
            }
        },
        params: [value.date, value.startTime, value.endTime],
    });

    const [contractHelper, setContractHelper] = useState("");
    const [hourCategoryHelper, setHourCategoryHelper] = useState("");
    const [endTimeHelper, setEndTimeHelper] = useState("");

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
        if (value.startTime && value.endTime && !LocalTime.parseString(value.startTime).isBefore(LocalTime.parseString(value.endTime))) {
            setEndTimeHelper("The end time is on the next day.");
        } else {
            setEndTimeHelper("");
        }
    }, [value.startTime, value.endTime]);

    return (
        <FormLayout responsiveSteps={responsiveSteps}>
            <ComboBox
                label={"Project"}
                items={projects.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}
                {...{colspan: 2}}
                {...field(model.project)}
            />
            <ErrorNotification message={"Error loading projects"}
                               opened={projects.isError}
                               onRetry={projects.retry}/>
            <ComboBox
                label={"Contract"}
                helperText={contractHelper}
                items={contracts.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}
                {...{colspan: 2}}
                {...field(model.contract)}
            />
            <ErrorNotification message={"Error loading contracts"}
                               opened={contracts.isError}
                               onRetry={contracts.retry}/>
            <DatePicker
                label={"Date"}
                {...{colspan: 2}}
                {...field(model.date)}
            />
            <TimePicker
                label={"Start time"}
                {...field(model.startTime)}
            />
            <TimePicker
                label={"End time"}
                helperText={endTimeHelper}
                {...field(model.endTime)}
            />
            <HorizontalLayout {...{colspan: 4}}>
                <span className={"text-xs text-secondary"}>{durationHelper.data}</span>
            </HorizontalLayout>
            <TextArea
                label={"Description"}
                {...{colspan: 4}}
                {...field(model.description)}
            />
            <ComboBox
                label={"Category"}
                helperText={hourCategoryHelper}
                items={hourCategories.data}
                itemLabelPath={"name"}
                itemValuePath={"id"}
                itemIdPath={"id"}
                {...{colspan: 4}}
                {...field(model.hourCategory)}
            />
            <ErrorNotification message={"Error loading hour categories"}
                               opened={hourCategories.isError}
                               onRetry={hourCategories.retry}/>
        </FormLayout>
    )
}