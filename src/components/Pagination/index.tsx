import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChanges: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;  
    })
    .filter((page) => page > 0);
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 6,
  currentPage = 1,
  onPageChanges,
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  return (
    <Stack
      direction={["column", "row"]}
      mt="8"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Box>
        <strong></strong>  <strong>{currentPage}</strong> de <strong>{Number(lastPage) == 1 ? currentPage : lastPage}</strong>
      </Box>
      <Stack direction={"row"} spacing="2">
        
        {currentPage > (1 + siblingsCount) && (
            <>
                <PaginationItem onPageChange={onPageChanges} number={1} />
                {currentPage > (2 + siblingsCount) && <Text color={'gray.300'} w={'8'} textAlign="center">...</Text>}
            </>
            
        )}

        {previousPages.length > 0 &&
          previousPages.map((page) => {
            return <PaginationItem onPageChange={onPageChanges} key={page} number={page} />;
          })}

        <PaginationItem onPageChange={onPageChanges} number={currentPage} isCurrent />

        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return <PaginationItem onPageChange={onPageChanges} key={page} number={page} />;
          })}

        {(currentPage + siblingsCount) < lastPage && (
            <>
                {(currentPage + 1 + siblingsCount) < lastPage && <Text color={'gray.300'} w={'8'} textAlign="center">...</Text>}
                <PaginationItem onPageChange={onPageChanges} number={lastPage} />
            </>
            
             
        )}
      </Stack>
    </Stack>
  );
}
