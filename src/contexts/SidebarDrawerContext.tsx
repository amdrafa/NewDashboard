import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {createContext, ReactNode, useContext, useEffect } from "react";

interface SidebarDrawerProviderProps{
    children: ReactNode,

}

type SidebarDrawerContextData = UseDisclosureReturn;

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({children}: SidebarDrawerProviderProps){

    const { asPath } = useRouter()

    const disclosure = useDisclosure()

    console.log(asPath)

    useEffect(() => {
        disclosure.onClose()
    }, [asPath])

    return (
        <SidebarDrawerContext.Provider value={disclosure}>
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext)