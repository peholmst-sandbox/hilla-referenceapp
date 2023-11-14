import {Notification} from "@hilla/react-components/Notification";
import {Button} from "@hilla/react-components/Button.js";
import {Icon} from "@hilla/react-components/Icon";

export type ErrorNotificationProps = {
    message: string;
    opened: boolean;
    onClose?: () => void;
    retry?: () => Promise<void>;
};

export default function ErrorNotification(props: ErrorNotificationProps) {

    function retry() {
        close();
        if (props.retry) {
            props.retry().then().catch(console.error);
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
            {props.retry ? (
                    <Button theme={"tertiary-inline"}
                            style={{marginLeft: "var(--lumo-space-xl)"}}
                            onClick={retry}>
                        Retry
                    </Button>)
                : null}
            <Button theme={"tertiary-inline icon"}
                    onClick={close} aria-label={"close"}>
                <Icon icon={"lumo:cross"}/>
            </Button>
        </Notification>
    );
}