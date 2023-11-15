import React, {createContext, Key, PropsWithChildren, useContext, useEffect, useReducer, useState} from "react";
import {Button} from "@hilla/react-components/Button";
import {Notification} from "@hilla/react-components/Notification";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {Icon} from "@hilla/react-components/Icon";

interface ErrorNotification {
    readonly id: Key;
    readonly message: string;
    readonly hiddenOnTimestamp?: number;
    readonly retryAction?: () => void;
}

interface ErrorNotificationElementProps {
    readonly notification: ErrorNotification;
    readonly dispatch: React.Dispatch<ErrorNotificationAction>;
}

function ErrorNotificationElement(props: ErrorNotificationElementProps) {

    const [opened, setOpened] = useState(true);

    function closeNotification() {
        setOpened(false);
        props.dispatch({name: ErrorNotificationActionName.CLOSE, notification: props.notification});
    }

    const retryButton = props.notification.retryAction ? (
        <Button theme={"tertiary-inline"}
                style={{marginLeft: "var(--lumo-space-xl)"}}
                onClick={() => {
                    closeNotification();
                    if (props.notification.retryAction) {
                        props.notification.retryAction();
                    }
                }}>
            Retry
        </Button>
    ) : null;

    return (
        <Notification theme={"error"}
                      duration={0}
                      position={"middle"}
                      opened={opened}>
            <HorizontalLayout theme={"spacing"} style={{alignItems: "center"}}>
                <div>{props.notification.message}</div>
                {retryButton}
                <Button theme={"tertiary-inline icon"}
                        onClick={() => {
                            closeNotification();
                        }}
                        aria-label={"close"}>
                    <Icon icon={"lumo:cross"}/>
                </Button>
            </HorizontalLayout>
        </Notification>
    )
}

enum ErrorNotificationActionName {
    SHOW = "show",
    CLOSE = "close",
    CLEANUP = "cleanup"
}

interface ShowNotificationAction {
    readonly name: ErrorNotificationActionName.SHOW;
    readonly message: string;
    readonly retryAction?: () => void;
}

interface CloseNotificationAction {
    readonly name: ErrorNotificationActionName.CLOSE;
    readonly notification: ErrorNotification;
}

interface CleanUpNotificationsAction {
    readonly name: ErrorNotificationActionName.CLEANUP;
}

type ErrorNotificationAction = ShowNotificationAction | CloseNotificationAction | CleanUpNotificationsAction;

const ErrorDispatchContext = createContext<React.Dispatch<ErrorNotificationAction> | null>(null);

function reducer(state: ErrorNotification[], action: ErrorNotificationAction): ErrorNotification[] {
    switch (action.name) {
        case ErrorNotificationActionName.SHOW: {
            return [{
                id: `${action.message}_${Date.now()}`,
                message: action.message,
                retryAction: action.retryAction,
            }, ...state];
        }
        case ErrorNotificationActionName.CLOSE: {
            // Instead of removing the notification here, we just mark it as invisible. Then, the transition animation
            // for hiding it should work normally.
            const index = state.findIndex(n => n.id == action.notification.id);
            if (index > -1) {
                state[index] = {...action.notification, hiddenOnTimestamp: Date.now()};
            }
            return state;
        }
        case ErrorNotificationActionName.CLEANUP: {
            const now = Date.now();
            // Here, we remove old error notifications that have already been closed, but with a little delay so that
            // the transition animation gets to complete.
            return state.filter(n => n.hiddenOnTimestamp === undefined || now - n.hiddenOnTimestamp < 2000);
        }
    }
}

/**
 * This component should be added to your main application component. It makes the context needed by the error handler
 * enabled for all child components.
 *
 * @param props
 * @constructor
 */
export function ErrorHandlerProvider(props: PropsWithChildren) {
    const [errors, dispatch] = useReducer(reducer, []);

    const elements = errors.map(error => <ErrorNotificationElement notification={error} dispatch={dispatch}
                                                                   key={error.id}/>);

    useEffect(() => {
        const handle = setInterval(() => {
            dispatch({name: ErrorNotificationActionName.CLEANUP});
        }, 1000);
        return () => clearInterval(handle);
    }, []);

    return (
        <ErrorDispatchContext.Provider value={dispatch}>
            {props.children}
            {elements}
        </ErrorDispatchContext.Provider>
    );
}

/**
 * An error handler that should be used to handle errors that occur when communicating with the server or performing
 * other types of I/O. This error handler should not be used for business errors, i.e. errors caused by the violation
 * of business rules (like different constraint violations). Those errors should be incorporated into the response
 * object coming from the server and handled accordingly inside the UI.
 *
 * @deprecated
 */
export interface ErrorHandler {

    /**
     * Shows an error notification to the user. A technical error is an error that has not been caused by the user.
     * It may go away by itself, or it may require actions by an administrator.
     *
     * @param error the error caught (for logging).
     * @param message the message to show to the user.
     */
    handleTechnicalError(error: any, message: string): void;

    /**
     * Shows an error notification to the user with an option to retry. A technical error is an error that has not been
     * caused by the user. It may go away by itself, or it may require actions by an administrator.
     *
     * @param error the error caught (for logging).
     * @param message the message to show to the user.
     * @param retryAction the action to run when the user clicks 'Retry'.
     */
    handleTechnicalErrorWithRetry(error: any, message: string, retryAction: () => void): void;
}

/**
 * Hook for retrieving the current {@link ErrorHandler}.
 *
 * @deprecated
 */
export function useErrorHandler(): ErrorHandler {
    const dispatch = useContext(ErrorDispatchContext);
    return {
        handleTechnicalError(error: any, message: string) {
            console.error("Caught technical error: ", error);
            if (dispatch) {
                dispatch({name: ErrorNotificationActionName.SHOW, message: message});
            }
        },
        handleTechnicalErrorWithRetry(error: any, message: string, retryAction: () => void) {
            console.error("Caught technical error: ", error);
            if (dispatch) {
                dispatch({name: ErrorNotificationActionName.SHOW, message: message, retryAction: retryAction});
            }
        }
    };
}