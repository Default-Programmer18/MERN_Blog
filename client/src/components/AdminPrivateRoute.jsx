import { useSelector } from "react-redux"
import Dashboard from "../pages/Dashboard"
import { Navigate, Outlet } from "react-router-dom"


const AdminPrivateRoute = () => {
    const  {currentUser}=useSelector(state=> state.user)
  return currentUser && currentUser.isAdmin ? <Outlet/>:<Navigate to="/sign-in"/>

}
//<Outlet/> is used to show the children of the routes when routes are nested


export default AdminPrivateRoute