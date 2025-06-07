export const mode = {
  development: "development",
  production: "production",
};

export const modePrefix = {
  dev_: "DEV_",
  prod_: "PROD_",
};

export const method = {
  get: "GET",
  put: "PUT",
  post: "POST",
  delete: "DELETE",
};

export const responseStatus = {
  success: "success",
  error: "error",
};

export const httpCode = {
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multiStatus: 207,
  alreadyReported: 208,
  iMUsed: 226,
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  temporaryRedirect: 307,
  permanentRedirect: 308,
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  URITooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  imATeapot: 418,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons: 451,
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,
};

export const text = {
  general: {
    server: "server on port ",
    connection: "connection",
  },
  response: {
    success: "success",
    message: {
      200: "Berhasil menampilkan data",
      201: "Berhasil membuat data",
      202: "berhasil memperbarui data",
      204: "Berhasil menghapus data",
      logout: "Berhasil logout",
      token_match: "Token Match",
      token_not_match: "Token not match",
      token_not_available: "Token not available",
      token_deleted: "Token Deleted",
      user_not_authenticated: "User not authenticated",
      database_error: "error database",
      timeout: "request timeout",
    },
    error: {
      default: "error",
    },
  },
};
