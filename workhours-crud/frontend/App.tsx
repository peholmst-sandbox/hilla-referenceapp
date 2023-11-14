import router from 'Frontend/routes.js';
import {RouterProvider} from 'react-router-dom';
import {ErrorHandlerProvider} from "Frontend/util/ErrorHandler";
import {SsoProvider} from "@hilla/sso-kit-client-react";
import OfflineIndicator from "Frontend/components/OfflineIndicator";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    return (
        <ErrorHandlerProvider>
            <QueryClientProvider client={queryClient}>
                <SsoProvider>
                    <RouterProvider router={router}/>
                </SsoProvider>
            </QueryClientProvider>
            <OfflineIndicator/>
        </ErrorHandlerProvider>
    );
}
