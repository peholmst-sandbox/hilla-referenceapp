import {ProjectAdminService} from "Frontend/generated/endpoints"
import {useServiceCall, useServiceQuery} from "Frontend/util/Service"
import OnlineOnly from "Frontend/components/OnlineOnly"
import WarningMessage from "Frontend/components/WarningMessage"
import ErrorNotification from "Frontend/components/ErrorNotification"
import {FormLayout} from "@hilla/react-components/FormLayout"
import SaveCancelButtons from "Frontend/components/SaveCancelButtons"
import {useForm, useFormPart} from "@hilla/react-form"
import ProjectDTOModel from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/ProjectDTOModel"
import {TextField} from "@hilla/react-components/TextField"
import ProjectDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/ProjectDTO"
import {useEffect, useState} from "react"
import {NotBlank} from "@hilla/form"
import Drawer from "Frontend/components/Drawer"
import {Grid} from "@hilla/react-components/Grid"
import {GridSortColumn} from "@hilla/react-components/GridSortColumn"
import {VerticalLayout} from "@hilla/react-components/VerticalLayout"
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout"
import {Button} from "@hilla/react-components/Button.js"
import AuditingInformation from "Frontend/components/AuditingInformation";

interface ProjectLoader {
    isNew: boolean

    load(read?: (project: ProjectDTO) => void, clear?: () => void): void
}

export default function ProjectAdminView() {
    const projects = useServiceQuery({
        serviceFunction: ProjectAdminService.findAll,
        params: [],
        fallbackResult: []
    })
    const save = useServiceCall({
        serviceFunction: ProjectAdminService.save,
        onSuccess: () => {
            projects.retry()
            hideDrawer()
        }
    })
    const [selection, setSelection] = useState<ProjectDTO[]>([])
    const [project, setProject] = useState<ProjectLoader | null>(null)
    const {field, model, invalid, submit, read, clear, value} = useForm(ProjectDTOModel, {
        onSubmit: save.callAsync
    })

    const nameField = useFormPart(model.name)

    useEffect(() => {
        nameField.addValidator(new NotBlank({message: "Please enter a project name."}))
    }, [])

    useEffect(() => {
        if (project) {
            project.load(read, clear)
        } else {
            clear()
        }
    }, [project])


    function addProject() {
        setProject({
            isNew: true,
            load(clear: () => void) {
                clear()
            }
        })
        setSelection([])
    }

    function editProject(project: ProjectDTO) {
        setProject({
            isNew: false,
            load(read: (project: ProjectDTO) => void) {
                read(project)
            }
        })
        setSelection([project])
    }

    function hideDrawer() {
        setProject(null)
        setSelection([])
    }

    return (
        <OnlineOnly
            fallback={<WarningMessage message={"Project management is not available offline."} className={"m-m"}/>}>
            <VerticalLayout theme={"spacing padding"} className={"w-full h-full overflow-hidden relative"}>
                <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                    <Button theme={"primary"} style={{flexGrow: 1}} onClick={addProject}>Add Project</Button>
                </HorizontalLayout>
                <Grid items={projects.data}
                      itemIdPath={"id"}
                      selectedItems={selection}
                      onActiveItemChanged={event => {
                          const item = event.detail.value
                          item ? editProject(item) : hideDrawer()
                      }}>
                    <GridSortColumn path={"name"} header={"Project Name"} resizable/>
                </Grid>
                <ErrorNotification message={"Error loading projects"} opened={projects.isError}
                                   onRetry={projects.retry}/>
                <Drawer opened={project !== null}>
                    {project && (<>
                        <h1 className={"text-xl text-header"}>{project.isNew ? "Add Project" : "Edit Project"}</h1>
                        <FormLayout>
                            <TextField label={"Project Name"}
                                       {...field(model.name)}/>
                        </FormLayout>
                        <AuditingInformation lastModifiedDate={value.modifiedOn}
                                             lastModifiedBy={value.modifiedBy}
                                             createdDate={value.createdOn}
                                             createdBy={value.createdBy}/>
                        <SaveCancelButtons onSave={submit} onCancel={hideDrawer}
                                           saveDisabled={invalid || save.isError || save.isPending}/>
                        <ErrorNotification message={"Error saving project"}
                                           opened={save.isError}
                                           onClose={save.reset}/>
                    </>)}
                </Drawer>
            </VerticalLayout>
        </OnlineOnly>
    )
}