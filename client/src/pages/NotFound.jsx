import { Link } from "react-router-dom";

//NotFound page that displays a 404 message and a link to go back home
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}