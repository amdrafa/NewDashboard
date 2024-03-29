import { Icon, Link as ChakraLink, Text, LinkProps as ChakraLinkProps} from "@chakra-ui/react";
import { ElementType, ReactNode } from "react";
import { RiInputMethodLine } from "react-icons/ri";
import Link from 'next/link'
import { ActiveLink } from "../activeLink";
import { MyPopoverTrigger } from "../PopOverTriggerComponent";

interface NavLinkProps extends ChakraLinkProps {
    icon: ElementType,
    children: string,
    hrefs: string
    hasPermission?: boolean;
}

export function NavLink({hrefs, icon, children, hasPermission, ...rest}: NavLinkProps){
    return (
        <ActiveLink href={hrefs} passHref>
        
            <ChakraLink display="flex" alignItems="center" cursor={hasPermission ? 'pointer' : 'not-allowed'} {...rest}>
                <Icon as={icon} fontSize="20"/>
                <Text ml="4" fontWeight="medium">{children}</Text>
            </ChakraLink>

        </ActiveLink>
    );
}