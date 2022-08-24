import { Text } from "@chakra-ui/react";

interface Logoprops {
    width?: string;
}

export function Logo({width = '200px'}:Logoprops){
    return (
        <Text
        fontSize={['2xl', '3xl']}
        fontWeight="bold"
        letterSpacing="tight"
        w={width}
        >
            Bosch
            <Text as="span" ml="1" color="red.500">
                .
            </Text>
        </Text>
    );
}