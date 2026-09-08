import { axiosInstance } from "@/shared/lib/axiosInstance"
import { userSchema } from "./types"

export async function whoami() {
  const { data } = await axiosInstance.get("/me")

  const result = userSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ не соответствует схеме User: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data
}
