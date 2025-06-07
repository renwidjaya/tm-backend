import { Request, Response, NextFunction } from "express";
import { httpCode } from "@utils/prefix";
import { IErrorResponse } from "@middlewares/error-handler";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: IErrorResponse = {
    code: httpCode.notFound,
    status: "error",
    message: "Page not found",
  };

  res.status(httpCode.notFound).json(response);
};
