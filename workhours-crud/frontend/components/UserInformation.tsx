import {useEffect, useState} from "react";
import UserDetailsDTO from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/identity/UserDetailsDTO";
import {UserDirectory} from "Frontend/generated/endpoints";
import {Button} from "@hilla/react-components/Button.js";
import {Dialog} from "@hilla/react-components/Dialog";
import {Avatar} from "@hilla/react-components/Avatar";

export interface UserInformationProps {
    userId: string;
}

export default function UserInformation(props: UserInformationProps) {
    const [userDetails, setUserDetails] = useState<UserDetailsDTO>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        // TODO Store user information in a local cache to avoid unnecessary network requests
        UserDirectory
            .findByUserId(props.userId)
            .then(setUserDetails)
            .catch(() => setUserDetails(undefined));
    }, [props.userId]);

    // TODO Not sure whether a dialog is the correct component here. Some kind of popup would be better.

    // TODO I would like the button to look like a link and not a button. Is there a standard way of doing that?

    if (userDetails) {
        return (
            <>
                <Button theme={"tertiary small"} onClick={() => setDialogOpen(true)}><Avatar
                    name={userDetails.displayName} img={userDetails.picture} theme={"xsmall"}
                    slot={"prefix"}></Avatar> {userDetails.displayName}</Button>
                <Dialog opened={dialogOpen}
                        onOpenedChanged={(event) => setDialogOpen(event.detail.value)}
                        draggable>
                    <div className={"flex flex-col gap-m m-l items-center"}>
                        <Avatar name={userDetails.displayName} img={userDetails.picture} theme={"xlarge"}></Avatar>
                        <div className={"text-l"}>{userDetails.displayName}</div>
                        {userDetails.email ?
                            <a href={"mailto:" + userDetails.email} target={"_blank"}>{userDetails.email}</a> : null}
                    </div>
                </Dialog>
            </>
        );
    } else {
        return <div>{props.userId}</div>
    }
}