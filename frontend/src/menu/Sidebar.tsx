
import { useState } from "react";
import type { ElementType } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    Box,
    Flex,
    Text,
    VStack,
    Drawer,
    IconButton,
    Portal,
    Button,
} from "@chakra-ui/react";

import { MdOutlineDashboard } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";

import { useAuth } from "../components/context/AuthContext";
import type { UserRole } from "../components/types/auth.types";
import { FiLogOut } from "react-icons/fi";

interface SidebarItem {
    title: string;
    url: string;
    icon: ElementType;
    end?: boolean;
}

// Role-wise sidebar menu
const sidebarItems: Record<UserRole, SidebarItem[]> = {
    admin: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: MdOutlineDashboard,
            end: true,
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
    ],

    doctor: [
        {
            title: "Dashboard",
            url: "/doctor",
            icon: MdOutlineDashboard,
            end: true,
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
    ],

    patient: [
        {
            title: "Dashboard",
            url: "/patient",
            icon: MdOutlineDashboard,
            end: true,
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
    ],
};

interface SidebarMenuProps {
    onNavigate?: () => void;
     onLogout: () => void | Promise<void>;
}

const SidebarMenu = ({ onNavigate, onLogout }: SidebarMenuProps) => {

    const { user, } = useAuth();


    if (!user) return null;

    const items = sidebarItems[user.role] ?? [];



    return (
        <Flex  direction="column" h="100%" minH="100%">
            <Box>
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
                    {items.map((item) => {
                        const ItemIcon = item.icon;

                        return (
                            <NavLink
                                key={item.title}
                                to={item.url}
                                end={item.end}
                                onClick={onNavigate}
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
             <Button
            mt="auto"
            w="100%"
            justifyContent="flex-start"
            gap={3}
            px={3}
            mb={2}
            variant="ghost"
            color="#475569"
            _hover={{
                bg: "#FEE2E2",
                color: "red.600",
            }}
            onClick={onLogout}
        >
            <FiLogOut size={20} />
            Logout
        </Button>
        </Flex>
    );
};

// Desktop Sidebar
const Sidebar = () => {
    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };
    return (
        <Box
            display={{ base: "none", md: "block" }}
            position="fixed"
            top="0"
            left="0"
            w="240px"
            h="100vh"
            overflowY="auto"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            py={5}
            px={3}
            fontFamily="Arial, sans-serif"
            zIndex="20"
        >
            <SidebarMenu onLogout={handleLogout} />
        </Box>
    );
};

// Mobile Sidebar Drawer
export const MobileSidebar = () => {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <Box display={{ base: "block", md: "none" }}>
            <Drawer.Root
                open={open}
                onOpenChange={(details) => setOpen(details.open)}
                placement="start"
                size="xs"
            >
                <Drawer.Trigger asChild>
                    <IconButton
                        aria-label="Open navigation menu"
                        variant="ghost"
                        color="#31B0E6"
                        size="lg"
                    >
                        <RiMenu2Fill size={24} />
                    </IconButton>
                </Drawer.Trigger>

                <Portal>
                    <Drawer.Backdrop />

                    <Drawer.Positioner>
                        <Drawer.Content bg="white">
                            <Drawer.Header
                                borderBottomWidth="1px"
                                borderColor="gray.200"
                            >
                                <Drawer.Title>Navigation</Drawer.Title>

                                <Drawer.CloseTrigger asChild>
                                    <IconButton
                                        aria-label="Close navigation menu"
                                        variant="ghost"
                                        size="sm"
                                    >
                                        ✕
                                    </IconButton>
                                </Drawer.CloseTrigger>
                            </Drawer.Header>

                            <Drawer.Body py={5} px={3}>
                                <SidebarMenu
                                    onNavigate={() => setOpen(false)}
                                    onLogout={handleLogout}
                                />
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </Box>
    );
};

export default Sidebar;
