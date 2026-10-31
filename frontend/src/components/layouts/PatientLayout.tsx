import { Box, Flex, Heading, Button } from "@chakra-ui/react";
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
      <Sidebar />

      <Box flex="1" minW="0">
        <Flex
          bg="white"
          p={4}
          justify="space-between"
          align="center"
          borderBottomWidth="1px"
        >
          <Heading size="md">
            Diabetic Diet Assistant
          </Heading>

          <Flex align="center" gap={3}>
            <Box>{user?.name}</Box>

            <Button onClick={handleLogout} size="sm">
              Logout
            </Button>
          </Flex>
        </Flex>

        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}

export default PatientLayout;