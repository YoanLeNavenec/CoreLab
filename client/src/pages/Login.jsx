import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginSchema } from "../schemas/auth.schema";

//Login page component that handles user login with form validation and error handling
export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  //Initialize react-hook-form with Zod validation schema and error handling
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  //Handles form submission, calls login function from auth store + sending to dashboard, with error display on failure
  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  //Renders login form with email and password fields, validation error messages, and a link to the registration page
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}