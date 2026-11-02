
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { MdOutlineDashboard } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";

import { useAuth } from "../components/context/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();

    const adminItems = [
        {
            title: "Dashboard",
            url: "/admin",
            icon: MdOutlineDashboard,
        },
        {
            title: "Patients",
            url: "/admin/patients",
            icon: RxPeople,
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: IoSettingsOutline,
        },
    ];

    const doctorItems = [
        {
            title: "Dashboard",
            url: "/doctor",
            icon: MdOutlineDashboard,
        },
        {
            title: "Patients",
            url: "/doctor/patients",
            icon: RxPeople,
        },
        {
            title: "Settings",
            url: "/doctor/settings",
            icon: IoSettingsOutline,
        },
    ];

    const patientItems = [
        {
            title: "Dashboard",
            url: "/patient",
            icon: MdOutlineDashboard,
        },
        {
            title: "Reports",
            url: "/patient/reports",
            icon: MdOutlineDashboard,
        },
        {
            title: "Settings",
            url: "/patient/settings",
            icon: IoSettingsOutline,
        },
    ];

    const menuItems = user?.role === "admin" ? adminItems : user?.role === "doctor" ? doctorItems : user?.role === "patient" ? patientItems : [];

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
            fontFamily="Arial, sans-serif"
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
                {menuItems.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.url}
                            end
                            style={{ textDecoration: "none" }}
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

                                    <Text fontSize="sm" fontWeight={500}>
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
