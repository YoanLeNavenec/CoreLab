import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import { registerSchema } from "../schemas/auth.schema";
import styles from "../styles/Auth.module.css";

export default function Register() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.logo}>Corelab</p>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>Start learning today</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`} type="text" {...register("name")} />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`} type="email" {...register("email")} />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={`${styles.input} ${errors.password ? styles.inputError : ''}`} type="password" {...register("password")} />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>I am a...</label>
            <select className={styles.input} {...register("role")}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.role && <p className={styles.error}>{errors.role.message}</p>}
          </div>

          {errors.root && <p className={styles.error}>{errors.root.message}</p>}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

        </form>
        <p className="text-muted" style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}