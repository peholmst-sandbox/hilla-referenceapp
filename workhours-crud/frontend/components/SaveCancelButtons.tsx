import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout"
import {Button} from "@hilla/react-components/Button.js"

export type SaveCancelButtonsProps = {
    onSave?: () => void
    onCancel?: () => void
    saveDisabled?: boolean
    saveCaption?: string
    cancelDisabled?: boolean
    cancelCaption?: string
}

export default function SaveCancelButtons(props: SaveCancelButtonsProps) {
    return (
        <HorizontalLayout theme={"spacing"}>
            {props.onSave && <Button theme={"primary"} style={{flexGrow: 1}} onClick={props.onSave}
                                     disabled={props.saveDisabled}>{props.saveCaption ? props.saveCaption : "Save"}</Button>}
            {props.onCancel && <Button style={{flexGrow: 1}} onClick={props.onCancel}
                                       disabled={props.cancelDisabled}>{props.cancelCaption ? props.cancelCaption : "Cancel"}</Button>}
        </HorizontalLayout>
    )
}