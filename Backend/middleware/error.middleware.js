import dotenv from "dotenv";
dotenv.config();
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.OriginalUrl}`);
  res.status(404);
  next(error);
};
const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError" && err.kind === "objectId") {
    statusCode = 400;
    message = "Resource not found";
  }
  res.status(statusCode).json({
    message,
    statck: process.env.NODE_ENV == "production" ? null : err.statck,
  });
};

export { errorHandler, notFound };
