import { Request, Response, NextFunction } from "express";
import { httpCode } from "@utils/prefix";

export interface IErrorResponse {
  code: number;
  status?: string;
  message: string;
}

export default class CustomError extends Error implements IErrorResponse {
  readonly status: string;

  constructor(public code: number, public message: string) {
    super(message);
    this.status = "error";
  }
}

export const errorhandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof CustomError) {
    res.status(error.code).json({
      code: error.code,
      status: "error",
      message: error.message,
    });
    return;
  }

  res.status(httpCode.internalServerError).json({
    code: httpCode.internalServerError,
    status: "error",
    message: error.message || "Internal server error",
  });
};
