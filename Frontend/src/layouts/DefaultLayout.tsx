import { lazy } from "react"
import { Outlet } from "react-router-dom"
const Header = lazy(() => import("../components/Header"))


const DefaultLayout = () => {
  return (
    <>
        <Header /> 
        <Outlet />
    </>
  )
}

export default DefaultLayout;


