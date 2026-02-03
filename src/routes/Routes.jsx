import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AllIssues from "../pages/AllIssues/AllIssues";
import IssueDetails from "../pages/AllIssues/IssueDetails";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import CitizenHome from "../pages/Dashboard/Citizen/CitizenHome";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues";
import FeaturesPage from "../pages/FeaturesPage/FeaturesPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import ErrorPage from "../pages/ErrorPage";

import StaffHome from "../pages/Dashboard/Staff/StaffHome";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues";
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues";
import Payments from "../pages/Dashboard/Admin/Payments";
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <GuestRoute><Login /></GuestRoute>,
            },
            {
                path: "/register",
                element: <GuestRoute><Register /></GuestRoute>,
            },
            {
                path: "/all-issues",
                element: <AllIssues />,
            },
            {
                path: "/features",
                element: <FeaturesPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/issues/:id",
                element: <PrivateRoute><IssueDetails /></PrivateRoute>,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardHome /></PrivateRoute>
    },
    // Citizen Routes
    {
        path: "/citizen",
        element: <PrivateRoute role="citizen"><DashboardLayout /></PrivateRoute>,
        children: [
            {
                path: "home",
                element: <CitizenHome />
            },
            {
                path: "report-issue",
                element: <ReportIssue />
            },
            {
                path: "my-issues",
                element: <MyIssues />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    },
    // Staff Routes
    {
        path: "/staff",
        element: <PrivateRoute role="staff"><DashboardLayout /></PrivateRoute>,
        children: [
            {
                path: "home",
                element: <StaffHome />
            },
            {
                path: "assigned-issues",
                element: <AssignedIssues />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    },
    // Admin Routes
    {
        path: "/admin",
        element: <PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>,
        children: [
            {
                path: "home",
                element: <AdminHome />
            },
            {
                path: "all-issues",
                element: <AdminAllIssues />
            },
            {
                path: "manage-users",
                element: <ManageUsers />
            },
            {
                path: "manage-staff",
                element: <ManageStaff />
            },
            {
                path: "payments",
                element: <Payments />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    }
]);

export default router;
