import { Box, Stack, Icon, Text, Link } from "@chakra-ui/react";
import { Children, ReactNode } from "react";
import { RiDashboardLine, RiContactsLine } from "react-icons/ri";

interface NavSectionProps{
    title: string,
    children: ReactNode

}

export function NavSection({title, children}: NavSectionProps) {
  return (
    <Box mt={4}>
      <Text fontWeight="bold" color="gray.400" fontSize="small">
        {title}
      </Text>
      <Stack spacing="4" mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  );
}
