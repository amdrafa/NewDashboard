import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface canProps {
    children: ReactNode;
    roles: string[];
}


export function Can({children, roles}: canProps){

    const userCanSeeComponent = useCan({
        roles
    })

    if (!userCanSeeComponent){
        return null
    }


    return (
        <>
            {children}
        </>
    )
}