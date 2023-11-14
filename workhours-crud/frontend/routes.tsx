import MainLayout from 'Frontend/views/MainLayout.js';
import WorkLogEntryDrawer from "Frontend/views/worklog/WorkLogEntryDrawer";
import {lazy} from 'react';
import {createBrowserRouter, IndexRouteObject, NonIndexRouteObject} from 'react-router-dom';
import WorkLogView from "Frontend/views/worklog/WorkLogView";
import {AccessProps, protectRoutes} from "@hilla/sso-kit-client-react";
import AdminView from "Frontend/views/admin/AdminView";

export type ViewRouteObject = (IndexRouteObject | NonIndexRouteObject) & AccessProps;

const AboutView = lazy(async () => import('Frontend/views/about/AboutView.js'));

export const routes: ViewRouteObject[] = protectRoutes([
    {
        element: <MainLayout/>,
        handle: {title: 'Main'},
        children: [
            {path: '/about', element: <AboutView/>, handle: {title: 'About'}},
            {path: '/entry', element: <WorkLogEntryDrawer/>, handle: {title: 'Time Entry'}},
            {path: '/workhours', element: <WorkLogView/>, handle: {title: "Workhours"}, requireAuthentication: true},
            {path: '/admin', element: <AdminView/>, handle: {title: "Admin"}, requireAuthentication: true}
        ],
    },
]);

export default createBrowserRouter(routes);
