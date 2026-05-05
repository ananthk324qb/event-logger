export class ErrorTemplate extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "ErrorTemplate";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isHttpError(error: unknown): error is ErrorTemplate {
  return typeof error === "object" && error !== null && "statusCode" in error;
}
