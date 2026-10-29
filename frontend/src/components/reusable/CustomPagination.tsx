
import {
    ButtonGroup,
    Flex,
    IconButton,
    Pagination,
} from "@chakra-ui/react";

import {
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";

interface CustomPaginationProps {
    total_values?: number;
    page?: number;
    limit?: number;
    setpage: (page: number) => void;
}

const CustomPagination = ({
    total_values = 0,
    page = 1,
    limit = 10,
    setpage,
}: CustomPaginationProps) => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
            py={2}
        >
            <Pagination.Root
                count={total_values}
                pageSize={limit}
                page={page}
                onPageChange={(e) => setpage(e.page)}
            >
                <ButtonGroup
                    gap={1}
                    variant="ghost"
                    alignItems="center"
                >
                    <Pagination.PrevTrigger asChild>
                        <IconButton
                            aria-label="Previous page"
                            variant="ghost"
                            size="md"
                            rounded="full"
                            color="#111"
                            _hover={{ bg: "transparent" }}
                        >
                            <HiChevronLeft size={28} />
                        </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Context>
                        {(pagination) => (
                            <Pagination.Items
                                render={(pageItem) => {
                                    const isSelected =
                                        pageItem.value === pagination.page;

                                    return (
                                        <IconButton
                                            key={pageItem.value}
                                            aria-label={`Page ${pageItem.value}`}
                                            variant="ghost"
                                            rounded="full"
                                            minW="25px"
                                            h="25px"
                                            fontSize="13px"
                                            fontWeight="400"
                                            color={isSelected ? "white" : "#111"}
                                            bg={isSelected ? "#31B0E6" : "transparent"}
                                            _hover={{
                                                bg: isSelected
                                                    ? "#31B0E6"
                                                    : "transparent",
                                            }}
                                        >
                                            {pageItem.value}
                                        </IconButton>
                                    );
                                }}
                            />
                        )}
                    </Pagination.Context>

                    <Pagination.NextTrigger asChild>
                        <IconButton
                            aria-label="Next page"
                            variant="ghost"
                            size="md"
                            rounded="full"
                            color="#111"
                            _hover={{ bg: "transparent" }}
                        >
                            <HiChevronRight size={28} />
                        </IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Flex>
    );
};

export default CustomPagination;
