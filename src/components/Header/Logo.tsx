import { Text } from "@chakra-ui/react";

export function Logo(){
    return (
        <Text
        fontSize={['2xl', '3xl']}
        fontWeight="bold"
        letterSpacing="tight"
        w="200px"
        >
            Bosch
            <Text as="span" ml="1" color="red.500">
                .
            </Text>
        </Text>
    );
}