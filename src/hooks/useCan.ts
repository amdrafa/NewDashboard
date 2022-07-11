import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

type useCanParams = {
   roles: string[];
}

export function useCan({roles}: useCanParams){

    const {user, isAuthenticated} = useContext(LoginContext)

    if(!isAuthenticated){
        return false
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