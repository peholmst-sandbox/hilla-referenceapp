import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Button} from "@hilla/react-components/Button.js";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {DatePicker} from "@hilla/react-components/DatePicker";
import {useEffect, useRef, useState} from "react";
import {Grid, type GridElement} from "@hilla/react-components/Grid";
import {GridColumn} from "@hilla/react-components/GridColumn";
import {useServiceCall, useServiceQuery} from "Frontend/util/Service";
import {ReferenceLookupService, WorkLogQueryObject, WorkLogService} from "Frontend/generated/endpoints";
import ProjectReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ProjectReference";
import ContractReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ContractReference";
import {nullToUndefined} from "Frontend/util/ServiceUtils";
import WorkLogQueryRecord
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogQueryRecord";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import {useDataProvider} from "Frontend/util/DataProvider";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import OnlineOnly from "Frontend/components/OnlineOnly";
import WarningMessage from "Frontend/components/WarningMessage";
import Drawer from "Frontend/components/Drawer";
import WorkLogEntryFormDTO
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTO";
import AuditingInformation from "Frontend/components/AuditingInformation";
import SaveCancelButtons from "Frontend/components/SaveCancelButtons";
import ErrorNotification from "Frontend/components/ErrorNotification";
import WorkLogEntryForm from "Frontend/views/worklog/WorkLogEntryForm";
import {useForm, UseFormResult} from "@hilla/react-form";
import WorkLogEntryFormDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTOModel";
import EmployeeReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/EmployeeReference";
import {useSsoContext} from "@hilla/sso-kit-client-react";

interface EntryLoader {
    isNew: boolean;

    load(form: UseFormResult<WorkLogEntryFormDTOModel>): void;
}

export default function WorkLogView() {
    const ssoContext = useSsoContext();
    const isManager = ssoContext.isUserInRole("MANAGER");

    const [filterByEmployee, setFilterByEmployee] = useState<EmployeeReference | null>();
    const [filterByProject, setFilterByProject] = useState<ProjectReference | null>();
    const [filterByContract, setFilterByContract] = useState<ContractReference | null>();
    const [filterFrom, setFilterFrom] = useState<string>();
    const [filterTo, setFilterTo] = useState<string>();
    const employees = useServiceQuery({
        serviceFunction: ReferenceLookupService.findEmployees,
        params: []
    });
    const projects = useServiceQuery({
        serviceFunction: ReferenceLookupService.findProjects,
        params: []
    });
    const contracts = useServiceQuery({
        serviceFunction: async (project: ProjectReference | null | undefined) => project ? await ReferenceLookupService.findContractsByProject(project) : [],
        params: [filterByProject]
    });
    const load = useServiceCall({
        serviceFunction: WorkLogService.loadForm,
        onSuccess: editForm
    });
    const save = useServiceCall({
        serviceFunction: WorkLogService.saveForm,
        onSuccess: () => {
            refreshGrid();
            hideDrawer();
        }
    });
    const dataProvider = useDataProvider({
        queryFunction: async (pageable) => {
            const {items, count} = await WorkLogQueryObject.find({
                employee: nullToUndefined(filterByEmployee),
                project: nullToUndefined(filterByProject),
                contract: nullToUndefined(filterByContract),
                fromDate: filterFrom,
                toDate: filterTo,
                pageable: pageable
            });
            return {items, count};
        },
        deps: [filterByEmployee, filterByProject, filterByContract, filterFrom, filterTo]
    });

    const grid = useRef<GridElement<WorkLogQueryRecord>>(null);
    const [selection, setSelection] = useState<WorkLogQueryRecord[]>([]);
    const [entry, setEntry] = useState<EntryLoader | null>(null);
    const form = useForm(WorkLogEntryFormDTOModel, {
        onSubmit: save.callAsync
    })


    useEffect(() => {
        if (entry) {
            entry.load(form);
        } else {
            form.clear();
        }
    }, [entry]);

    function addEntry() {
        setEntry({
            isNew: true,
            load(form: UseFormResult<WorkLogEntryFormDTOModel>) {
                form.clear();
                WorkLogService.ownEmployeeReference().then(employee => {
                    form.value.employee = employee;
                });
            }
        });
        setSelection([]);
    }

    function editEntry(entry: WorkLogQueryRecord) {
        load.call(entry.id);
        setSelection([entry]);
    }

    function editForm(entry?: WorkLogEntryFormDTO) {
        if (entry) {
            setEntry({
                isNew: false,
                load(form: UseFormResult<WorkLogEntryFormDTOModel>) {
                    form.read(entry);
                }
            });
        } else {
            hideDrawer();
        }
    }

    function hideDrawer() {
        setEntry(null);
        setSelection([]);
    }

    function refreshGrid() {
        grid.current?.clearCache();
    }

    return (
        <>
            <OnlineOnly
                fallback={<WarningMessage message={"Worklog entry is not available offline."} className={"m-m"}/>}>
                <VerticalLayout theme={"spacing padding"} className={"w-full h-full overflow-hidden relative"}>
                    <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                        <Button theme={"primary"} style={{flexGrow: 1}} onClick={addEntry}>Add</Button>
                        {isManager && (<ComboBox
                            items={employees.data}
                            placeholder={"Filter by Employee"}
                            style={{flexGrow: 1}}
                            itemLabelPath={"name"}
                            clearButtonVisible={true}
                            selectedItem={filterByEmployee}
                            onSelectedItemChanged={e => setFilterByEmployee(e.detail.value)}
                        />)}
                        <ComboBox
                            items={projects.data}
                            placeholder={"Filter by Project"}
                            style={{flexGrow: 1}}
                            itemLabelPath={"name"}
                            clearButtonVisible={true}
                            selectedItem={filterByProject}
                            onSelectedItemChanged={e => setFilterByProject(e.detail.value)}
                        />
                        <ComboBox
                            items={contracts.data}
                            placeholder={"Filter by Contract"}
                            style={{flexGrow: 1}}
                            itemLabelPath={"name"}
                            clearButtonVisible={true}
                            selectedItem={filterByContract}
                            onSelectedItemChanged={e => setFilterByContract(e.detail.value)}
                        />
                        <DatePicker
                            placeholder={"From"}
                            style={{flexGrow: 1}}
                            value={filterFrom}
                            clearButtonVisible={true}
                            onValueChanged={e => setFilterFrom(e.detail.value)}
                        />
                        <DatePicker
                            placeholder={"To"}
                            style={{flexGrow: 1}}
                            value={filterTo}
                            clearButtonVisible={true}
                            onValueChanged={e => setFilterTo(e.detail.value)}
                        />
                    </HorizontalLayout>
                    <Grid dataProvider={dataProvider}
                          selectedItems={selection}
                          onActiveItemChanged={event => {
                              const item = event.detail.value;
                              item ? editEntry(item) : hideDrawer();
                          }}
                          ref={grid}>
                        <GridSortColumn path={"employee.name"} header={"Employee"} resizable/>
                        <GridSortColumn path={"project.name"} header={"Project"} resizable/>
                        <GridSortColumn path={"contract.name"} header={"Contract"} resizable/>
                        <GridSortColumn path={"date"} header={"Date"} resizable/>
                        <GridColumn path={"durationInSeconds"} header={"Duration"} resizable/>
                        <GridColumn path={"description"} header={"Description"} resizable/>
                        <GridColumn path={"hourCategory.name"} header={"Hour Category"} resizable/>
                    </Grid>
                    <Drawer opened={entry !== null}>
                        {entry && (<>
                            <h1 className={"text-xl text-header"}>{entry.isNew ? "Add Work" : "Edit Work"}</h1>
                            <WorkLogEntryForm form={form}/>
                            <AuditingInformation lastModifiedDate={form.value.modifiedOn}
                                                 lastModifiedBy={form.value.modifiedBy}
                                                 createdDate={form.value.createdOn}
                                                 createdBy={form.value.createdBy}/>
                            <SaveCancelButtons onSave={form.submit} onCancel={hideDrawer}
                                               saveCaption={entry.isNew ? "Add Work" : "Update Work"}
                                               saveDisabled={form.invalid || save.isError || save.isPending}/>
                            <ErrorNotification message={"Error saving work"}
                                               opened={save.isError}
                                               onClose={save.reset}/>
                        </>)}
                    </Drawer>
                </VerticalLayout>
            </OnlineOnly>
        </>
    );
}