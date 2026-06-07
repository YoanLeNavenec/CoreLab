import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./auth.schema.js";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass123",
      role: "student",
    });
    expect(result.success).toBe(true);
  });

  it("defaults role to student if not provided", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
    expect(result.data.role).toBe("student");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "alice@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.name).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.email).toBeDefined();
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.password).toBeDefined();
  });

  it("rejects an invalid role", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass123",
      role: "superadmin",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.role).toBeDefined();
  });
});

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "alice@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({
      email: "alice@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.password).toBeDefined();
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.email).toBeDefined();
  });
});