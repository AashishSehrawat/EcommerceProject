import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import toast from "react-hot-toast"
import { Navigate, Outlet } from "react-router-dom"

export const UserRoute = () => {
    const {user} = useSelector((state: RootState) => state.auth)
    if(!user) {
        toast.error("Please login to access this page")
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export const AdminRoute = () => {
    const {user} = useSelector((state: RootState) => state.auth)
    if(!user) {
        toast.error("please login to access this page")
        return <Navigate to="/login" replace />
    }
    if(user.role !== "admin") {
        toast.error("You are not authorized to access this page")
        return <Navigate to="/" replace />
    }

    return <Outlet />
}