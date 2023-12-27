import { createBrowserRouter } from "react-router-dom";
import Checkout from "../Pages/Checkout";
import App from "../App";
import EnrolledCourses from "../Pages/Dashboard/EnrolledCourses";
import AdminLayout from "../Pages/Dashboard/Admin/AdminLayout";
import Registrations from "../Pages/Dashboard/Admin/Registrations";
import Admin from "../Pages/Dashboard/Admin/Admin";
import AdminCourses from "../Pages/Dashboard/Admin/AdminCourses";
import AddCourse from "../Pages/Dashboard/Admin/AddCourse";
import EditCourse from "../Pages/Dashboard/Admin/EditCourse";
import AddStudent from "../Pages/Dashboard/Admin/AddStudent";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/enrolled-courses",
    element: <EnrolledCourses />,
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: "registrations",
        element: <Registrations />,
      },
      {
        path: "courses",
        element: <AdminCourses />,
      },
      {
        path: "add-course",
        element: <AddCourse />,
      },
      {
        path: "edit-course/:id",
        element: <EditCourse />,
      },
      {
        path: "register-student",
        element: <AddStudent />,
      },
    ],
  },
]);
