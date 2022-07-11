import { Flex, Box, Icon,Text } from "@chakra-ui/react";


interface ChooseVehicleProps{
  isActive: boolean;
  vehicleType: string;
  icon: any;
  onClick: () => void;
}

export function ChooseVehicle({isActive, vehicleType, icon, onClick}:ChooseVehicleProps) {
  return (
    <>
      
      
        <Flex
          cursor="pointer"
          mt="-3"
          w="100%"
          background="gray.900"
          borderRadius="lg"
          justifyContent="center"
          alignItems="center"
          height="200px"
          border={isActive ? "solid" : "none"}
          borderColor={isActive ? "blue.500" : "none"}
          onClick={onClick}
        >
          <Box textAlign="center" justifyContent="center">
            <Icon
              as={icon}
              fontSize="50"
              color="gray.200"
              mb="1.4"
            />
            <Text fontSize="20" fontWeight="bold" color="gray.100">
              {vehicleType}
            </Text>
          </Box>
        </Flex>

      
    </>
  );
}
