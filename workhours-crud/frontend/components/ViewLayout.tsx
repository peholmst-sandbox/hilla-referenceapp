import {PropsWithChildren, ReactNode} from "react";
import "./ViewLayout.css";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import Drawer from "Frontend/components/Drawer";

export type ViewLayoutProps = {
    drawerOpened?: boolean,
    drawer?: ReactNode
} & PropsWithChildren;

// TODO This may not actually be very helpful
export default function ViewLayout(props: ViewLayoutProps) {
    return (
        <VerticalLayout className={"view-layout"} theme={"padding spacing"}>
            {props.children}
            {props.drawer && <Drawer opened={props.drawerOpened || false}>{props.drawer}</Drawer>}
        </VerticalLayout>
    );
}