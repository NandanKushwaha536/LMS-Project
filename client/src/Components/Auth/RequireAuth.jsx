import {useSelector} from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom'

function RequireAuth({allowedRoles}) {

    const {isLoggdIn, role}=useSelector((state)=>state.auth);

    return isLoggdIn && allowedRoles.find((myRole)=>myRole ==role)?(
        <Outlet/>
    ):isLoggdIn ? (<Navigate to="/denied"/>):(<Navigate to=""/>)
  
}

export default RequireAuth