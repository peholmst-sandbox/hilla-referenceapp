import {Icon} from "@hilla/react-components/Icon";
import "@vaadin/icons";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import React from "react";

export type WarningMessageProps = {
    message: string;
    className?: string;
}

export default function WarningMessage(props: WarningMessageProps) {

    return (
        <HorizontalLayout theme={"spacing"}
                          className={"p-s text-warning rounded-m border border-warning items-center " + props.className}>
            <Icon icon={"vaadin:exclamation-circle"}/>
            <span>{props.message}</span>
        </HorizontalLayout>
    );
}