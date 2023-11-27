import {Notification} from "@hilla/react-components/Notification";
import {Button} from "@hilla/react-components/Button.js";
import {Icon} from "@hilla/react-components/Icon";
import "@vaadin/icons";

export type ErrorNotificationProps = {
    message: string;
    opened: boolean;
    onClose?: () => void;
    onRetry?: () => (void | Promise<void>);
};

export default function ErrorNotification(props: ErrorNotificationProps) {

    function retry() {
        close();
        if (props.onRetry) {
            const result = props.onRetry();
            if (result instanceof Promise) {
                result.then();
            }
        }
    }

    function close() {
        if (props.onClose) {
            props.onClose();
        }
    }

    return (
        <Notification theme={"error"} duration={0} position={"middle"} opened={props.opened}>
            <div>{props.message}</div>
            {props.onRetry && (
                <Button theme={"tertiary-inline"}
                        style={{marginLeft: "var(--lumo-space-xl)"}}
                        onClick={retry}>
                    Retry
                </Button>)}
            {props.onClose && (<Button theme={"tertiary-inline icon"}
                                       onClick={close} aria-label={"close"}>
                <Icon icon={"lumo:cross"}/>
            </Button>)}
        </Notification>
    );
}