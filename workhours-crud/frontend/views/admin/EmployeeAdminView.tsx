import {EmployeeAdminService} from "Frontend/generated/endpoints"
import {useServiceCall, useServiceQuery} from "Frontend/util/Service"
import OnlineOnly from "Frontend/components/OnlineOnly"
import WarningMessage from "Frontend/components/WarningMessage"
import ErrorNotification from "Frontend/components/ErrorNotification"
import {FormLayout} from "@hilla/react-components/FormLayout"
import SaveCancelButtons from "Frontend/components/SaveCancelButtons"
import {useForm, useFormPart} from "@hilla/react-form"
import {TextField} from "@hilla/react-components/TextField"
import {useEffect, useState} from "react"
import {NotBlank} from "@hilla/form"
import Drawer from "Frontend/components/Drawer"
import {Grid} from "@hilla/react-components/Grid"
import {GridSortColumn} from "@hilla/react-components/GridSortColumn"
import {VerticalLayout} from "@hilla/react-components/VerticalLayout"
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout"
import {Button} from "@hilla/react-components/Button.js"
import AuditingInformation from "Frontend/components/AuditingInformation"
import EmployeeDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/EmployeeDTO"
import EmployeeDTOModel from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/EmployeeDTOModel"
import UserPicker from "Frontend/components/UserPicker";

interface EmployeeLoader {
    isNew: boolean

    load(read?: (employee: EmployeeDTO) => void, clear?: () => void): void
}

export default function EmployeeAdminView() {
    const employees = useServiceQuery({
        serviceFunction: EmployeeAdminService.findAll,
        params: [],
        fallbackResult: []
    })
    const save = useServiceCall({
        serviceFunction: EmployeeAdminService.save,
        onSuccess: () => {
            employees.retry()
            hideDrawer()
        }
    })
    const [selection, setSelection] = useState<EmployeeDTO[]>([])
    const [employee, setEmployee] = useState<EmployeeLoader | null>(null)
    const {field, model, invalid, submit, read, clear, value} = useForm(EmployeeDTOModel, {
        onSubmit: save.callAsync
    })

    const firstNameField = useFormPart(model.firstName)
    const lastNameField = useFormPart(model.lastName)

    useEffect(() => {
        firstNameField.addValidator(new NotBlank({message: "Please enter a first name."}))
        lastNameField.addValidator(new NotBlank({message: "Please enter a last name."}))
    }, [])

    useEffect(() => {
        if (employee) {
            employee.load(read, clear)
        } else {
            clear()
        }
    }, [employee])


    function addEmployee() {
        setEmployee({
            isNew: true,
            load(clear: () => void) {
                clear()
            }
        })
        setSelection([])
    }

    function editEmployee(employee: EmployeeDTO) {
        setEmployee({
            isNew: false,
            load(read: (employee: EmployeeDTO) => void) {
                read(employee)
            }
        })
        setSelection([employee])
    }

    function hideDrawer() {
        setEmployee(null)
        setSelection([])
    }

    // TODO UserPicker is not integrating well with the form. Need to figure out how to do that.

    return (
        <OnlineOnly
            fallback={<WarningMessage message={"Employee management is not available offline."} className={"m-m"}/>}>
            <VerticalLayout theme={"spacing padding"} className={"w-full h-full overflow-hidden relative"}>
                <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                    <Button theme={"primary"} style={{flexGrow: 1}} onClick={addEmployee}>Add Employee</Button>
                </HorizontalLayout>
                <Grid items={employees.data}
                      itemIdPath={"id"}
                      selectedItems={selection}
                      onActiveItemChanged={event => {
                          const item = event.detail.value
                          item ? editEmployee(item) : hideDrawer()
                      }}>
                    <GridSortColumn path={"firstName"} header={"First name"} resizable/>
                    <GridSortColumn path={"lastName"} header={"Last name"} resizable/>
                </Grid>
                <ErrorNotification message={"Error loading employees"} opened={employees.isError}
                                   onRetry={employees.retry}/>
                <Drawer opened={employee !== null}>
                    {employee && (<>
                        <h1 className={"text-xl text-header"}>{employee.isNew ? "Add Employee" : "Edit Employee"}</h1>
                        <FormLayout>
                            <TextField label={"First Name"}
                                       {...field(model.firstName)}/>
                            <TextField label={"Last Name"}
                                       {...field(model.lastName)}/>
                            <UserPicker label={"Corresponding User"}
                                        value={value.user}
                                        onValueChanged={userId => value.user = userId}/>
                        </FormLayout>
                        <AuditingInformation lastModifiedDate={value.modifiedOn}
                                             lastModifiedBy={value.modifiedBy}
                                             createdDate={value.createdOn}
                                             createdBy={value.createdBy}/>
                        <SaveCancelButtons onSave={submit} onCancel={hideDrawer}
                                           saveDisabled={invalid || save.isError || save.isPending}/>
                        <ErrorNotification message={"Error saving employee"}
                                           opened={save.isError}
                                           onClose={save.reset}/>
                    </>)}
                </Drawer>
            </VerticalLayout>
        </OnlineOnly>
    )
}