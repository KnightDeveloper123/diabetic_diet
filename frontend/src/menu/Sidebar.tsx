
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { MdOutlineDashboard } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = () => {
    const sidebarItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: MdOutlineDashboard,
        },
        {
            title: "Patients",
            url: "/patients",
            icon: RxPeople,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: IoSettingsOutline,
        },
    ];

    return (
        <Box
            w="240px"
            minW="240px"
            h="100vh"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            py={5}
            px={3}
        >
            <Text
                fontSize="xl"
                fontWeight="bold"
                color="#31B0E6"
                px={3}
                mb={8}
            >
                Diabetic Diet
            </Text>

            <VStack align="stretch" gap={2}>
                {sidebarItems.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.url}
                            end
                        >
                            {({ isActive }) => (
                                <Flex
                                    align="center"
                                    gap={3}
                                    px={3}
                                    py={3}
                                    borderRadius="8px"
                                    bg={isActive ? "#E0F2FE" : "transparent"}
                                    color={isActive ? "#31B0E6" : "#475569"}
                                    fontWeight={isActive ? "600" : "400"}
                                    _hover={{
                                        bg: "#E0F2FE",
                                        color: "#31B0E6",
                                    }}
                                    transition="0.2s"
                                    cursor="pointer"
                                >
                                    <ItemIcon size={21} />

                                    <Text fontSize="sm">
                                        {item.title}
                                    </Text>
                                </Flex>
                            )}
                        </NavLink>
                    );
                })}
            </VStack>
        </Box>
    );
};

export default Sidebar;
