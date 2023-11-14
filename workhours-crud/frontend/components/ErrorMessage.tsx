import {Icon} from "@hilla/react-components/Icon";
import "@vaadin/icons";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import React from "react";
import {Button} from "@hilla/react-components/Button";

export type ErrorMessageProps = {
    message: string;
    retry?: () => Promise<void>;
}

export default function ErrorMessage(props: ErrorMessageProps) {

    function retry() {
        if (props.retry) {
            props.retry().then().catch(console.error);
        }
    }

    return (
        <HorizontalLayout theme={"spacing"} className={"p-s text-error rounded-m border border-error items-center"}>
            <Icon icon={"vaadin:exclamation-circle"}/>
            <span>{props.message}</span>
            {props.retry && <Button theme={"primary error small"} onClick={retry}>Retry</Button>}
        </HorizontalLayout>
    );
}