import {PropsWithChildren} from "react";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import "./Drawer.css";

export type DrawerProps = {
    opened: boolean;
} & PropsWithChildren;

export default function Drawer(props: DrawerProps) {
    return (
        <VerticalLayout className={"drawer" + (props.opened ? " opened" : "")} theme={"padding spacing"}>
            {props.children}
        </VerticalLayout>
    );
}