import Link, {LinkProps} from "next/link";
import { useRouter } from "next/router";
import { Children, cloneElement, ReactElement } from "react";

interface ActiveLinksProps extends LinkProps{
    children: ReactElement;
    shouldMatchExactHref?: boolean;
}

export function ActiveLink({children, shouldMatchExactHref= false, ...rest}: ActiveLinksProps){
    const { asPath } = useRouter()
    let isActive = false;

    if(shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)){
        isActive = true;
    }

    if(!shouldMatchExactHref && (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))){
        isActive = true
    }

    return (
        <Link {...rest}>
            {cloneElement(children, {
                color: isActive ? 'blue.500' : 'gray.50'
            })}
        </Link>
    );
}