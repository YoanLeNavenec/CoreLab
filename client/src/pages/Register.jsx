import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { registerSchema } from "../schemas/auth.schema";

//Register page component that handles user registration with form validation and error handling
export default function Register() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  //React-hook-form with Zod validation schema and error handling, with default role set to "student"
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
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

  //Registration form with name, email, password, and role fields, validation error messages, and a link to the login page
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Name</label>
          <input type="text" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

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

        <div>
          <label>I am a...</label>
          <select {...register("role")}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role && <p>{errors.role.message}</p>}
        </div>

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}