import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import AppRouter from "./router/AppRouter";

//Main App component that initializes authentication state and renders the router
export default function App() {
  const { init, loading } = useAuthStore();

  //On app startup, attempt to restore session by checking for access token and validating it
  useEffect(() => {
    init();
  }, []);
  //Show loading state while checking authentication status
  if (loading) 
    return <div>Loading...</div>;
  //Once loading is complete, render the main application router
  return <AppRouter />;
}