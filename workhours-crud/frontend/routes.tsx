import MainLayout from 'Frontend/views/MainLayout.js';
import {lazy} from 'react';
import {createBrowserRouter, IndexRouteObject, NonIndexRouteObject} from 'react-router-dom';
import {AccessProps, protectRoutes} from "@hilla/sso-kit-client-react";

export type ViewRouteObject = (IndexRouteObject | NonIndexRouteObject) & AccessProps;

const WorkLogView = lazy(async () => import("Frontend/views/worklog/WorkLogView.js"));
const ProjectAdminView = lazy(async () => import("Frontend/views/admin/ProjectAdminView"));
const ContractAdminView = lazy(async () => import("Frontend/views/admin/ContractAdminView"));
const HourCategoryAdminView = lazy(async () => import("Frontend/views/admin/HourCategoryAdminView"));
const EmployeeAdminView = lazy(async () => import("Frontend/views/admin/EmployeeAdminView"));
const DashboardView = lazy(async () => import( "Frontend/views/dashboard/DashboardView"));

export const routes: ViewRouteObject[] = protectRoutes([
    {
        element: <MainLayout/>,
        handle: {title: 'Main'},
        children: [
            {path: '/workhours', element: <WorkLogView/>, handle: {title: "Workhours"}, requireAuthentication: true},
            {
                path: '/admin/projects',
                element: <ProjectAdminView/>,
                handle: {title: "Manage Projects"},
                requireAuthentication: true
            },
            {
                path: '/admin/contracts',
                element: <ContractAdminView/>,
                handle: {title: "Manage Contracts"},
                requireAuthentication: true
            },
            {
                path: '/admin/hourcategories',
                element: <HourCategoryAdminView/>,
                handle: {title: "Manage Hour Categories"},
                requireAuthentication: true
            },
            {
                path: '/admin/employees',
                element: <EmployeeAdminView/>,
                handle: {title: "Manage Employees"},
                requireAuthentication: true
            },
            {
                path: '/',
                element: <DashboardView/>,
                handle: {title: "Dashboard"},
                requireAuthentication: true
            }
        ],
    },
]);

export default createBrowserRouter(routes);
