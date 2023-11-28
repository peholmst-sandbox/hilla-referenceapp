import {SideNavItem} from "@hilla/react-components/SideNavItem";
import {PropsWithChildren, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

export type FixedSideNavItemProps = {
    path: string;
    slot?: string;
} & PropsWithChildren;

// TODO This is a workaround for https://github.com/vaadin/web-components/issues/6468
export default function FixedSideNavItem(props: FixedSideNavItemProps) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.dispatchEvent(new Event("popstate"));
    }, [location]);

    return (
        <SideNavItem path={props.path} slot={props.slot} onClick={e => {
            e.preventDefault();
            navigate(props.path);
        }}>
            {props.children}
        </SideNavItem>
    );
}