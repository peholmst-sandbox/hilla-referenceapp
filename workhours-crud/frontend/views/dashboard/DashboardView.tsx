import {useState} from "react";
import {Notification} from "@hilla/react-components/Notification";
import {Checkbox} from "@hilla/react-components/Checkbox";
import {Button} from "@hilla/react-components/Button.js";

export default function DashboardView() {
    const [visible, setVisible] = useState(false);

    return (<>
        <Checkbox label={"Show notification"} checked={visible}
                  onCheckedChanged={event => setVisible(event.detail.value)}/>
        <Button onClick={() => {
            setVisible(true);
            setTimeout(() => setVisible(false), 500);
            setTimeout(() => setVisible(true), 600);
        }}>Toggle</Button>
        <Notification opened={visible} duration={0}>Hello World</Notification>
    </>);
}