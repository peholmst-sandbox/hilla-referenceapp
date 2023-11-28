import {ComboBox} from "@hilla/react-components/ComboBox";
import {useServiceCall} from "Frontend/util/Service";
import {UserDirectory} from "Frontend/generated/endpoints";
import {useEffect, useState} from "react";
import UserDetailsDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/identity/UserDetailsDTO";

export type UserPickerProps = {
    label?: string,
    value?: string,
    onValueChanged?: (value: string | undefined) => void // TODO Replace with real event object?
}

// TODO This UserPicker is not behaving as it should and needs to be fixed!

export default function UserPicker(props: UserPickerProps) {
    const findUsersByUsername = useServiceCall({
        serviceFunction: UserDirectory.findByUsername,
        fallbackResult: [],
        onSuccess: users => {
            setAvailableUsers(users)
        }
    })
    const findUserById = useServiceCall({
        serviceFunction: UserDirectory.findByUserId,
        fallbackResult: null,
        onSuccess: user => {
            setAvailableUsers(user ? [user] : [])
            setSelectedUser(user)
        }
    })
    const [selectedUser, setSelectedUser] = useState<UserDetailsDTO | null | undefined>(null);
    const [availableUsers, setAvailableUsers] = useState<UserDetailsDTO[]>([]);

    useEffect(() => {
        if (props.value) {
            findUserById.call(props.value)
        } else {
            setAvailableUsers([])
            setSelectedUser(null)
        }
    }, [props.value]);

    useEffect(() => {
        props.onValueChanged?.(selectedUser?.id)
    }, [selectedUser]);

    return (<ComboBox label={props.label}
                      selectedItem={selectedUser}
                      items={availableUsers}
                      itemValuePath={"id"}
                      itemIdPath={"id"}
                      itemLabelPath={"username"}
                      allowCustomValue
                      onCustomValueSet={event => {
                          findUsersByUsername.call(event.detail, false)
                      }}
                      onSelectedItemChanged={event => setSelectedUser(event.detail.value)}/>)
}