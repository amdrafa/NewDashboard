import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

type useCanParams = {
   roles?: string[];
   permissions?: string[]
}

export function useCan({roles, permissions}: useCanParams){

    const {user, isAuthenticated} = useContext(LoginContext)

    if(!isAuthenticated){
        return false
    }

    if(permissions?.length > 0){
        const hasAllPermissions = permissions.every(permission => {
            return user.permissions.includes(permission)
        })


        if(!hasAllPermissions){
            return false
        }
    }

   if(roles?.length > 0){
    
       const hasAllRoles = roles.some(role => {
           return user.roles.includes(role)
       });

       if(!hasAllRoles){
           return false
       }
   } 

   return true

}