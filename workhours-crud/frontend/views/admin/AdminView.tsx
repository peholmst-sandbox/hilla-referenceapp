// TODO Deny access if not admin
import {Tabs} from "@hilla/react-components/Tabs";
import {Tab} from "@hilla/react-components/Tab";
import React from "react";
import {TabSheet} from "@hilla/react-components/TabSheet";
import ProjectAdminView from "Frontend/views/admin/ProjectAdminView";
import ContractAdminView from "Frontend/views/admin/ContractAdminView";
import HourCategoryAdminView from "Frontend/views/admin/HourCategoryAdminView";

export default function AdminView() {
    console.debug("Rendering AdminView");
    return (<>
        <TabSheet className={"h-full w-full overflow-hidden"}>
            <Tabs slot={"tabs"}>
                <Tab id={"projects-tab"}>Projects</Tab>
                <Tab id={"contracts-tab"}>Contracts</Tab>
                <Tab id={"hour-categories-tab"}>Hour categories</Tab>
            </Tabs>
            <div className={"h-full w-full overflow-hidden"} {...{tab: "projects-tab"}}><ProjectAdminView/></div>
            <div className={"h-full w-full overflow-hidden"} {...{tab: "contracts-tab"}}><ContractAdminView/></div>
            <div className={"h-full w-full overflow-hidden"} {...{tab: "hour-categories-tab"}}><HourCategoryAdminView/>
            </div>
        </TabSheet>
    </>);
}