export type ActionStateSuccess<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionStateFailed = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResponse<T = unknown> = Promise<ActionStateSuccess<T> | ActionStateFailed>;

export type RedirectAction = Promise<never | ActionStateFailed>;
