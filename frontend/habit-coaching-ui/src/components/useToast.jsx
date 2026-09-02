import { useEffect } from "react"
import { toast } from "react-toastify"

export default function useToast(serverError, successMessage) {
    useEffect(() => {
        if (serverError) {
            toast.error(serverError)
        }
    }, [serverError])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
        }
    }, [successMessage])
}