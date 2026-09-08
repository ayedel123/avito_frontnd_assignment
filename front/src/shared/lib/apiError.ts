import axios from "axios"

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

interface ApiErrorResponse {
  error?: ApiError
}

export interface NormalizedApiError {
  status?: number
  code?: string
  message: string
}

export function getApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      status: error.response?.status,
      code: error.response?.data?.error?.code,
      message: error.response?.data?.error?.message ?? error.message,
    }
  }

  return {
    message: error instanceof Error ? error.message : "Неизвестная ошибка",
  }
}
