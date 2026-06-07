import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CourseList from "../pages/CourseList";
import CourseDetail from "../pages/CourseDetail";
import QuizPage from "../pages/QuizPage";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "courses", element: <CourseList /> },
      { path: "courses/:id", element: <CourseDetail /> },

      // protected routes (any logged in user)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "courses/:courseId/quiz", element: <QuizPage /> },
        ],
      },

      // protected routes (instructor and admin only)
      {
        element: <ProtectedRoute roles={["instructor", "admin"]} />,
        children: [
          { path: "courses/new", element: <div>Create Course</div> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}