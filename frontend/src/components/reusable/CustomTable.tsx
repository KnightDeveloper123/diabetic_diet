
import { Table } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface TableHeader {
    name: string;
}

interface CustomTableProps {
    headers?: TableHeader[];
    children: ReactNode;
    borderradius?: string;
    [key: string]: any;
}

const CustomTable = ({
    headers = [],
    children,
    borderradius = "10px",
    ...rest
}: CustomTableProps) => {
    return (
        <Table.ScrollArea
            w="100%"
            borderRadius={borderradius}
            borderBottomRadius="10px"
            overflowX="auto"
            {...rest}
        >
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        {headers.map((header, index) => (
                            <Table.ColumnHeader
                                key={index}
                                bg="#F8F8F8"
                                borderTopLeftRadius={
                                    index === 0 ? "10px" : "none"
                                }
                                borderTopRightRadius={
                                    index === headers.length - 1
                                        ? "10px"
                                        : "none"
                                }
                                whiteSpace="nowrap"
                                textAlign="left"
                                border="none"
                            >
                                {header.name}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                {children}
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default CustomTable;
