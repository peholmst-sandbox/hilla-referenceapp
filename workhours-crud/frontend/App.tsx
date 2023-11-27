import router from 'Frontend/routes.js';
import {RouterProvider} from 'react-router-dom';
import {SsoProvider} from "@hilla/sso-kit-client-react";
import OfflineIndicator from "Frontend/components/OfflineIndicator";

export default function App() {
    return (
        <>
            <SsoProvider>
                <RouterProvider router={router}/>
            </SsoProvider>
            <OfflineIndicator/>
        </>
    );
}
