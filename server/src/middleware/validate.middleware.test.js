import { describe, it, expect, vi } from "vitest";
import { validate } from "./validate.middleware.js";
import { z } from "zod";

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const testSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

describe("validate middleware", () => {
  it("calls next() and sets req.body to sanitized data when valid", () => {
    const req = { body: { name: "Alice", email: "alice@example.com", extraField: "ignored" } };
    const res = mockRes();
    const next = vi.fn();

    validate(testSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    // extra fields should be stripped by Zod
    expect(req.body).toEqual({ name: "Alice", email: "alice@example.com" });
  });

  it("returns 400 with field errors when invalid", () => {
    const req = { body: { name: "A", email: "not-an-email" } };
    const res = mockRes();
    const next = vi.fn();

    validate(testSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Validation failed" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", () => {
    const req = { body: {} };
    const res = mockRes();
    const next = vi.fn();

    validate(testSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});