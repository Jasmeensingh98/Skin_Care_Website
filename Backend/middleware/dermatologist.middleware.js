import asyncHandler from "express-async-handler";

const dermatologistOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const role = req.user.role?.toLowerCase();
  if (role !== "dermatologist" && role !== "admin") {
    res.status(403);
    throw new Error("Dermatologist access only");
  }
  next();
});

export { dermatologistOnly };
