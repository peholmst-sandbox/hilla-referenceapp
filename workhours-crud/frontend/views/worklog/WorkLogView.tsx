import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {AutoGrid} from "@hilla/react-crud";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Button} from "@hilla/react-components/Button.js";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {DatePicker} from "@hilla/react-components/DatePicker";
import WorkLogEntryDrawer from "Frontend/views/worklog/WorkLogEntryDrawer";
import {useEffect, useState} from "react";
import {handleTechnicalError} from "Frontend/components/ErrorHandler";
import ProjectReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/ProjectReference";
import ContractReference
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/ContractReference";
import {WorkLog} from "Frontend/generated/endpoints";
import WorkLogListEntryDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogListEntryDTOModel";
import WorkLogListEntryDTO
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogListEntryDTO";
import WorkLogEntryFormDTO
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTO";

export default function WorkLogView() {

    const [projects, setProjects] = useState<ProjectReference[]>([]);
    const [contracts, setContracts] = useState<ContractReference[]>([]);
    const [selection, setSelection] = useState<WorkLogListEntryDTO[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerEntryId, setDrawerEntryId] = useState<number>();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        WorkLog.findProjects()
            .then((data) => setProjects(data))
            .catch((error) => handleTechnicalError(error, "An error occurred while retrieving projects."));
    }, []); // TODO Populate other combo boxes as well

    // TODO Apply filters

    function onCancel() {
        closeDrawer();
    }

    function onSave(entry: WorkLogEntryFormDTO) {
        refreshGrid();
        closeDrawer();
    }

    function addEntry() {
        setDrawerEntryId(-Date.now()); // TODO Would prefer to be able to call a method here.
        setDrawerVisible(true);
        setSelection([]);
    }

    function editEntry(entry: WorkLogListEntryDTO) {
        setDrawerEntryId(entry.id);
        setDrawerVisible(true);
        setSelection([entry]);
    }

    function closeDrawer() {
        setDrawerVisible(false);
        setSelection([]);
    }

    function refreshGrid() {
        setRefreshTrigger(Date.now); // TODO Would prefer to be able to call a method here.
    }

    return (
        <>
            <VerticalLayout theme={"padding spacing"}
                            className={"work-log-view" + (drawerVisible ? " drawer-visible" : "")}>
                <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                    <ComboBox
                        items={projects}
                        placeholder={"Filter by Project"}
                        style={{flexGrow: 1}}
                        itemLabelPath={"name"}
                        clearButtonVisible={true}
                    />
                    <ComboBox
                        items={contracts}
                        placeholder={"Filter by Contract"}
                        style={{flexGrow: 1}}
                        itemLabelPath={"name"}
                        clearButtonVisible={true}
                    />
                    <DatePicker placeholder={"From"} style={{flexGrow: 1}}/>
                    <DatePicker placeholder={"To"} style={{flexGrow: 1}}/>
                    <Button theme={"primary"} style={{flexGrow: 1}} onClick={addEntry}>Add</Button>
                </HorizontalLayout>
                <AutoGrid
                    service={WorkLog}
                    model={WorkLogListEntryDTOModel}
                    noHeaderFilters={true}
                    visibleColumns={["project.name", "contract.name", "date", "startTime", "endTime", "description", "hourCategory.name"]}
                    selectedItems={selection}
                    onActiveItemChanged={(e) => {
                        const item = e.detail.value;
                        if (item) {
                            editEntry(item);
                        } else {
                            closeDrawer();
                        }
                    }}
                    refreshTrigger={refreshTrigger}
                />
                <WorkLogEntryDrawer className={"work-log-entry-drawer"} workLogEntryId={drawerEntryId}
                                    onCancel={onCancel}
                                    onSave={onSave}></WorkLogEntryDrawer>
            </VerticalLayout>
        </>
    );
}