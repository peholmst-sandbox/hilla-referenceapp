import {HourCategoryAdminService} from "Frontend/generated/endpoints";
import {useServiceCall, useServiceQuery} from "Frontend/util/Service";
import WarningMessage from "Frontend/components/WarningMessage";
import React, {useEffect, useState} from "react";
import OnlineOnly from "Frontend/components/OnlineOnly";
import ErrorNotification from "Frontend/components/ErrorNotification";
import HourCategoryDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/HourCategoryDTO";
import HourCategoryDTOModel
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/admin/HourCategoryDTOModel";
import {useForm, useFormPart} from "@hilla/react-form";
import {NotBlank} from "@hilla/form";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Button} from "@hilla/react-components/Button";
import {Grid} from "@hilla/react-components/Grid";
import {GridSortColumn} from "@hilla/react-components/GridSortColumn";
import Drawer from "Frontend/components/Drawer";
import {FormLayout} from "@hilla/react-components/FormLayout";
import {TextField} from "@hilla/react-components/TextField";
import SaveCancelButtons from "Frontend/components/SaveCancelButtons";
import AuditingInformation from "Frontend/components/AuditingInformation";

interface HourCategoryLoader {
    isNew: boolean

    load(read?: (hourCategory: HourCategoryDTO) => void, clear?: () => void): void
}

export default function HourCategoryAdminView() {
    const hourCategories = useServiceQuery({
        serviceFunction: HourCategoryAdminService.findAll,
        params: [],
        fallbackResult: []
    })
    const save = useServiceCall({
        serviceFunction: HourCategoryAdminService.save,
        onSuccess: () => {
            hourCategories.retry()
            hideDrawer()
        }
    })
    const [selection, setSelection] = useState<HourCategoryDTO[]>([])
    const [hourCategory, setHourCategory] = useState<HourCategoryLoader | null>(null)
    const {field, model, invalid, submit, read, clear, value} = useForm(HourCategoryDTOModel, {
        onSubmit: save.callAsync
    })

    const nameField = useFormPart(model.name)

    useEffect(() => {
        nameField.addValidator(new NotBlank({message: "Please enter a hour category name."}))
    }, [])

    useEffect(() => {
        if (hourCategory) {
            hourCategory.load(read, clear)
        } else {
            clear()
        }
    }, [hourCategory])

    function addHourCategory() {
        setHourCategory({
            isNew: true,
            load(clear: () => void) {
                clear()
            }
        })
        setSelection([])
    }

    function editHourCategory(hourCategory: HourCategoryDTO) {
        setHourCategory({
            isNew: false,
            load(read: (hourCategory: HourCategoryDTO) => void) {
                read(hourCategory)
            }
        })
        setSelection([hourCategory])
    }

    function hideDrawer() {
        setHourCategory(null)
        setSelection([])
    }

    return (
        <OnlineOnly fallback={<WarningMessage message={"Hour category management is not available offline."}
                                              className={"m-m"}/>}>
            <VerticalLayout theme={"spacing padding"} className={"w-full h-full overflow-hidden relative"}>
                <HorizontalLayout theme={"spacing"} style={{flexWrap: "wrap"}}>
                    <Button theme={"primary"} style={{flexGrow: 1}} onClick={addHourCategory}>Add Hour Category</Button>
                </HorizontalLayout>
                <Grid items={hourCategories.data}
                      itemIdPath={"id"}
                      selectedItems={selection}
                      onActiveItemChanged={event => {
                          const item = event.detail.value
                          item ? editHourCategory(item) : hideDrawer()
                      }}>
                    <GridSortColumn path={"name"} header={"Hour Category Name"} resizable/>
                </Grid>
                <ErrorNotification message={"Error loading hour categories"} opened={hourCategories.isError}
                                   onRetry={hourCategories.retry}/>
                <Drawer opened={hourCategory !== null}>
                    {hourCategory && (<>
                        <h1 className={"text-xl text-header"}>{hourCategory.isNew ? "Add Hour Category" : "Edit Hour Category"}</h1>
                        <FormLayout>
                            <TextField label={"Hour Category Name"}
                                       {...field(model.name)}/>
                        </FormLayout>
                        <AuditingInformation lastModifiedDate={value.modifiedOn}
                                             lastModifiedBy={value.modifiedBy}
                                             createdDate={value.createdOn}
                                             createdBy={value.createdBy}/>
                        <SaveCancelButtons onSave={submit} onCancel={hideDrawer}
                                           saveDisabled={invalid || save.isError || save.isPending}/>
                        <ErrorNotification message={"Error saving hour category"}
                                           opened={save.isError}
                                           onClose={save.reset}/>
                    </>)}
                </Drawer>
            </VerticalLayout>
        </OnlineOnly>
    )
}
