
import { Box, Flex, Heading, Button, Text } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../../../src/menu/Sidebar";

function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <Flex direction="column" flex="1" minW="0">
        {/* Responsive header */}
        <Flex
          bg="white"
          px={{ base: 3, md: 5 }}
          py={3}
          justify="space-between"
          align="center"
          gap={2}
          borderBottomWidth="1px"
          borderColor="gray.200"
          h="64px"
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Flex align="center" gap={{ base: 1, md: 3 }} minW="0">
            {/* Mobile drawer trigger */}
            {/* <MobileSidebar /> */}

            <Heading
              size={{ base: "sm", md: "md" }}
              color="gray.800"
              truncate
            >
              Diabetic Diet Assistant
            </Heading>
          </Flex>

          <Flex align="center" gap={{ base: 2, md: 3 }} flexShrink="0">
            <Text
              display={{ base: "none", sm: "block" }}
              fontSize="sm"
              color="gray.600"
              maxW="140px"
              truncate
            >
              {user?.name}
            </Text>

            <Button
              onClick={handleLogout}
              size="sm"
              colorPalette="blue"
              variant="outline"
            >
              Logout
            </Button>
          </Flex>
        </Flex>

        {/* Page content */}
        <Box
          p={{ base: 3, sm: 4, md: 6 }}
          flex="1"
          minW="0"
          overflowY={'auto'}
          h={'calc(100vh - 64px)'}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}

export default PatientLayout;
