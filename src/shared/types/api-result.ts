type ApiFailure = { success: false; error: string };

type ApiResult = { success: true } | ApiFailure;

type ApiResultWithData<T> = { success: true; data: T } | ApiFailure;

export type { ApiResult, ApiResultWithData };
