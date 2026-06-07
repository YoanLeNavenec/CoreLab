import { describe, it, expect, vi } from "vitest";
import { requireRole } from "./role.middleware.js";

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("requireRole", () => {
  it("calls next() when the user has the required role", () => {
    const req = { user: { role: "instructor" } };
    const res = mockRes();
    const next = vi.fn();

    requireRole("instructor", "admin")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("calls next() when the user is an admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = vi.fn();

    requireRole("instructor", "admin")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when the user does not have the required role", () => {
    const req = { user: { role: "student" } };
    const res = mockRes();
    const next = vi.fn();

    requireRole("instructor", "admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient permissions" });
    expect(next).not.toHaveBeenCalled();
  });
});