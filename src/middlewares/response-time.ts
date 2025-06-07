import { Request, Response, NextFunction } from "express";

export const responseTime = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userAgent: string;

  if (req.get("id_user")) {
    userAgent = `ID USER : ${req.get("id_user")}`;
  } else {
    const getUserAgent = req.get("user-agent");
    const platform = getPlatform(getUserAgent || "");
    userAgent = `IP : ${
      req.get("x-real-ip") || req.get("host")
    } - PLATFORM : ${platform}`;
  }

  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDateTime.toTimeString().split(" ")[0]; // HH:MM:SS

    const responseTimeFormatted =
      elapsedTimeInMs < 1000
        ? Math.round(elapsedTimeInMs)
        : elapsedTimeInMs.toFixed(2);

    console.log(
      `${formattedDate} ${formattedTime} | ${userAgent} | ${req.method} | URL: ${req.originalUrl} | ${responseTimeFormatted} ms`
    );
  });

  next();
};

const getPlatform = (userAgent: string): string => {
  let platform = "REST API";

  if (/Windows NT/.test(userAgent)) {
    platform = "Windows";
  } else if (/Mac OS X/.test(userAgent)) {
    platform = "macOS";
  } else if (/Linux/.test(userAgent)) {
    platform = "Linux";
  } else if (/Android/.test(userAgent)) {
    platform = "Android";
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    platform = "iOS";
  } else {
    platform = userAgent;
  }

  return platform;
};
