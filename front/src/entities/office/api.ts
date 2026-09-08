import { axiosInstance } from "@/shared/lib/axiosInstance"
import { officesSchema } from "./types"

export async function getOffices() {
  const { data } = await axiosInstance.get("/offices")

  const result = officesSchema.safeParse(data)
  if (!result.success) {
    const errorMessage = `Ответ /offices не соответствует схеме: ${result.error.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return result.data
}
