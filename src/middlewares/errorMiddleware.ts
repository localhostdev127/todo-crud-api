import { Request, Response, NextFunction } from "express";

interface ErrorResponse extends Error {
  statusCode?: number;
}

const errorMiddleware = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  if(!res.sendStatus){
    res.status(statusCode)
  }
  res.json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export default errorMiddleware;
