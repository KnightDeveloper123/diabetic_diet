import {
  Box,
  Flex,
  Heading,
  // Button,
  Text,
} from "@chakra-ui/react";

import { Outlet, } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Sidebar, {
  MobileSidebar,
} from "../../../src/menu/Sidebar";

function PatientLayout() {
  const { user } = useAuth();
  // const navigate = useNavigate();



  return (
    <Box minH="100vh" bg="gray.50" >

      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <Box
        ml={{ base: "0", md: "240px" }}
        minH="100vh"
      >
        {/* Fixed Navbar */}
        <Flex
          position="fixed"
          top="0"
          left={{ base: "0", md: "240px" }}
          right="0"
          h="64px"
          bg="white"
          px={{ base: 3, md: 5 }}
          justify="space-between"
          align="center"
          gap={2}
          borderBottomWidth="1px"
          borderColor="gray.200"
          zIndex="15"
        >
          {/* Left Side */}
          <Flex align="center" gap={2} minW="0">
            <MobileSidebar />

            <Heading
              size={{ base: "sm", md: "md" }}
              color="gray.800"
              truncate
            >
              Diabetic Diet Assistant
            </Heading>
          </Flex>

          {/* Right Side */}
          <Flex align="center" gap={3} flexShrink="0">
            {/* <Avatr */}
            <Text
              display={{ base: "none", sm: "block" }}
              fontSize="sm"
              color="gray.600"
            >
              {user?.name}
            </Text>

            {/* <Button
              onClick={handleLogout}
              size="sm"
              colorPalette="blue"
              variant="outline"
            >
              Logout
            </Button> */}
          </Flex>
        </Flex>

        {/* Page Content */}
        <Box
          pt="64px"
          p={{ base: 3, sm: 4, md: 6 }}
          mt="64px"
          minH="100vh"
          minW="0"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default PatientLayout;