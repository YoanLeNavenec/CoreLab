import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyToken } from "./auth.middleware.js";
import jwt from "jsonwebtoken";

// mock the entire jsonwebtoken module
vi.mock("jsonwebtoken");

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);  // allows chaining: res.status(401).json(...)
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("verifyToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();  // reset mocks between each test
  });

  it("calls next() and sets req.user with a valid token in the header", () => {
    const req = {
      headers: { authorization: "Bearer validtoken" },
      cookies: {},
    };
    const res = mockRes();
    const next = vi.fn();

    jwt.verify.mockReturnValue({ id: "user123", role: "student" });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "user123", role: "student" });
  });

  it("calls next() with a valid token in the cookie", () => {
    const req = {
      headers: {},
      cookies: { token: "cookietoken" },
    };
    const res = mockRes();
    const next = vi.fn();

    jwt.verify.mockReturnValue({ id: "user456", role: "instructor" });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "user456", role: "instructor" });
  });

  it("returns 401 when no token is provided", () => {
    const req = { headers: {}, cookies: {} };
    const res = mockRes();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the token is invalid", () => {
    const req = {
      headers: { authorization: "Bearer invalidtoken" },
      cookies: {},
    };
    const res = mockRes();
    const next = vi.fn();

    jwt.verify.mockImplementation(() => { throw new Error("invalid token"); });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, invalid token" });
    expect(next).not.toHaveBeenCalled();
  });
});