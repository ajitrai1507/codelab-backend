export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;

  constructor({
    success,
    message,
    data,
    meta,
  }: {
    success: boolean;
    message: string;
    data?: T;
    meta?: any;
  }) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}