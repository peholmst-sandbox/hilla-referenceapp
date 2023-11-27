import {ContractAdminService, ReferenceLookupService} from "Frontend/generated/endpoints";
import {useServiceCall, useServiceQuery} from "Frontend/util/Service";
import ContractDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/ContractDTO";
import {useEffect, useState} from "react";
import ContractDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/ContractDTOModel";
import {useForm, useFormPart} from "@hilla/react-form";
import {NotBlank, NotEmpty, NotNull} from "@hilla/form";
import OnlineOnly from "Frontend/components/OnlineOnly";
import WarningMessage from "Frontend/components/WarningMessage";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Button} from "@hilla/react-components/Button";
import {Grid} from "@hilla/react-components/Grid";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import ErrorNotification from "Frontend/components/ErrorNotification";
import Drawer from "Frontend/components/Drawer";
import {FormLayout} from "@hilla/react-components/FormLayout";
import SaveCancelButtons from "Frontend/components/SaveCancelButtons";
import {GridColumn} from "@hilla/react-components/GridColumn";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {TextField} from "@hilla/react-components/TextField";
import {MultiSelectComboBox} from "@hilla/react-components/MultiSelectComboBox";
import HourCategoryDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/HourCategoryDTO";
import AuditingInformation from "Frontend/components/AuditingInformation";

interface ContractLoader {
    isNew: boolean

    load(read?: (contract: ContractDTO) => void, clear?: () => void): void
}

export default function ContractAdminView() {
    const contracts = useServiceQuery({
        serviceFunction: ContractAdminService.findAll,
        fallbackResult: [],
        params: []
    })
    const projects = useServiceQuery({
        serviceFunction: ReferenceLookupService.findProjects,
        fallbackResult: [],
        params: []
    })
    const hourCategories = useServiceQuery({
        serviceFunction: ReferenceLookupService.findHourCategories,
        fallbackResult: [],
        params: []
    })
    const save = useServiceCall({
        serviceFunction: ContractAdminService.save,
        onSuccess: () => {
            contracts.retry()
            hideDrawer()
        }
    })
    const [selection, setSelection] = useState<ContractDTO[]>([])
    const [contract, setContract] = useState<ContractLoader | null>(null)
    const {field, model, invalid, submit, read, clear, value} = useForm(ContractDTOModel, {
        onSubmit: save.callAsync
    })

    const nameField = useFormPart(model.name)
    const projectField = useFormPart(model.project)
    const allowedHourCategoriesField = useFormPart(model.allowedHourCategories)

    useEffect(() => {
        nameField.addValidator(new NotBlank({message: "Please enter a contract name."}))
        projectField.addValidator(new NotNull({message: "Please select a project."}))
        allowedHourCategoriesField.addValidator(new NotEmpty({message: "Please select at least one hour category."}))
    }, []);

    useEffect(() => {
        if (contract) {
            contract.load(read, clear)
        } else {
            clear()
        }
    }, [contract]);

    function addContract() {
        setContract({
            isNew: true,
            load(clear: () => void) {
                clear()
            }
        })
        setSelection([])
    }

    function editContract(contract: ContractDTO) {
        setContract({
            isNew: false,
            load(read: (contract: ContractDTO) => void) {
                read(contract)
            }
        })
        setSelection([contract])
    }

    function hideDrawer() {
        setContract(null)
        setSelection([])
    }

    return (
        <OnlineOnly
            fallback={<WarningMessage message={"Contract management is not available offline."} className={"m-m"}/>}>
            <VerticalLayout theme={"spacing padding"} className={"w-full h-full overflow-hidden relative"}>
                <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                    <Button theme={"primary"} style={{flexGrow: 1}} onClick={addContract}>Add Contract</Button>
                </HorizontalLayout>
                <Grid items={contracts.data}
                      itemIdPath={"id"}
                      selectedItems={selection}
                      onActiveItemChanged={event => {
                          const item = event.detail.value
                          item ? editContract(item) : hideDrawer()
                      }}>
                    <GridSortColumn path={"project.name"} header={"Project"} resizable/>
                    <GridSortColumn path={"name"} header={"Contract Name"} resizable/>
                    <GridColumn path={"allowedHourCategories"} header={"Allowed Hour Categories"} resizable>
                        {({item}) => item.allowedHourCategories.map((category: HourCategoryDTO) => category.name).join(", ")}
                    </GridColumn>
                </Grid>
                <ErrorNotification message={"Error loading projects"} opened={projects.isError}
                                   onRetry={projects.retry}/>
                <Drawer opened={contract !== null}>
                    {contract && (<>
                        <h1 className={"text-xl text-header"}>{contract.isNew ? "Add Contract" : "Edit Contract"}</h1>
                        <FormLayout>
                            <ComboBox label={"Project"}
                                      items={projects.data}
                                      itemLabelPath={"name"}
                                      itemIdPath={"id"}
                                      itemValuePath={"id"}
                                      {...field(model.project)}/>
                            <TextField label={"Contract Name"}
                                       {...field(model.name)}/>
                            <MultiSelectComboBox label={"Allowed Hour Categories"}
                                                 items={hourCategories.data}
                                                 itemLabelPath={"name"}
                                                 itemIdPath={"id"}
                                                 itemValuePath={"id"}
                                                 {...field(model.allowedHourCategories)}/>
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