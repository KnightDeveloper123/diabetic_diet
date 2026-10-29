
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack, Link as ChakraLink,
  IconButton,

} from "@chakra-ui/react";
import { FaCircleDot } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

import type {
  LoginResponse,
  UserRole,
} from "../../types/auth.types";

interface LoginForm {
  email: string;
  password: string;
}

function getDashboardPath(role: UserRole) {
  switch (role) {
    case "admin":
      return "/admin";
    case "doctor":
      return "/doctor";
    case "patient":
      return "/patient";
  }
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async () => {
    setServerError("");

    try {
      // Dummy login response
      // Replace with your API response when backend is ready.
      const response: LoginResponse = {
        token: "dummy-jwt-token",
        user: {
          id: "1",
          name: "Priyanka",
          email: "priyanka17@mailinator.com",
          role: "admin",
        },
      };

      const result = response;

      login(result);

      navigate(getDashboardPath(result.user.role), {
        replace: true,
      });
    } catch {
      setServerError("Login failed. Please try again.");
    }
  };

  return (
    <Flex
      minH="100vh"
      w="100%"
      bg="#F8FAFC"
      align="flex-start"
      justify="center"
      mt="50px"
      px={{ base: 4, sm: 10 }}
      py={{ base: 6, md: 10 }}
    >
      <Box
        w="100%"
        maxW="440px"
        bg="white"
        p={{ base: 5, sm: 7, md: 8 }}
        borderRadius="16px"
        border="1px solid"
        borderColor="#F1F5F9"
        boxShadow="0 4px 24px rgba(0, 0, 0, 0.05)"
      >
        {/* App Heading */}
        <Flex
          align="flex-start"
          justify="flex-start"
          gap={2}
          mb={{ base: 7, md: 9 }}
        >
          <FaCircleDot
            size={22}
            color="#2563EB"
            style={{ flexShrink: 0 }}
          />

          <Text
            fontSize={{ base: "17px", sm: "20px", md: "21px" }}
            fontWeight="700"
            color="#2563EB"
            lineHeight="1.3"
          >
            Diabetic Diet Assistant
          </Text>
        </Flex>

        {/* Doctor Access Badge */}
        <Flex justify="flex-start" mb={4}>
          <Box
            // bg="#DCFCE7"
            color="#15803D"
          // px={3}

          // borderRadius="full"
          >
            <Text
              fontSize="14px"
              fontWeight="600"
            // letterSpacing="1px"
            >
              DOCTOR ACCESS
            </Text>
          </Box>
        </Flex>

        {/* Login Heading */}
        <Heading
          as="h1"
          textAlign="flex-start"
          fontSize={{ base: "28px", sm: "32px" }}
          fontWeight="700"
          color="#111111"
          mb={2}
        >
          Log in
        </Heading>

        <Text
          textAlign="flex-start"
          fontSize={{ base: "13px", sm: "14px" }}
          color="#6B7280"
          lineHeight="1.6"
          mb={{ base: 6, md: 7 }}
        >
          Welcome back. Log in to review your patients
        </Text>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={5} align="stretch">
            {/* Email */}
            <Box>
              <Text
                mb={2}
                fontSize="14px"
                fontWeight="400"
                color="#374151"
              >
                Email address *
              </Text>

              <Input
                type="email"
                placeholder="ananya.rao@example.com"
                h="46px"
                px={3}
                fontSize="14px"
                color="#111827"
                border="1px solid"
                borderColor="#D1D5DB"
                borderRadius="7px"
                _placeholder={{ color: "#9CA3AF" }}
                _hover={{ borderColor: "#9CA3AF" }}
                _focusVisible={{
                  borderColor: "#2563EB",
                  boxShadow: "0 0 0 1px #2563EB",
                }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />

              {errors.email && (
                <Text color="red.500" fontSize="12px" mt={1}>
                  {errors.email.message}
                </Text>
              )}
            </Box>



            {/* Password */}
            <Box>
              <Text
                mb={2}
                fontSize="14px"
                fontWeight="400"
                color="#374151"
              >
                Password *
              </Text>

              <Box position="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  h="46px"
                  px={3}
                  pr="45px"
                  fontSize="14px"
                  color="#111827"
                  border="1px solid"
                  borderColor="#D1D5DB"
                  borderRadius="7px"
                  _placeholder={{ color: "#9CA3AF" }}
                  _hover={{ borderColor: "#9CA3AF" }}
                  _focusVisible={{
                    borderColor: "#2563EB",
                    boxShadow: "0 0 0 1px #2563EB",
                  }}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right="6px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="#6B7280"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  _hover={{ bg: "transparent" }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </IconButton>
              </Box>

              {errors.password && (
                <Text color="red.500" fontSize="12px" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </Box>


            {/* Server Error */}
            {serverError && (
              <Text color="red.500" fontSize="sm">
                {serverError}
              </Text>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              w="100%"
              h="46px"
              bg="#2563EB"
              color="white"
              borderRadius="7px"
              fontSize="15px"
              fontWeight="600"
              loading={isSubmitting}
              _hover={{ bg: "#1D4ED8" }}
              _active={{ bg: "#1E40AF" }}
            >
              Log in
            </Button>
          </VStack>
        </form>

        {/* Register Link */}
        <Text
          textAlign="center"
          mt={6}
          fontSize={{ base: "12px", sm: "13px" }}
          color="#6B7280"
          lineHeight="1.8"
        >
          New to the platform?{" "}
          <ChakraLink
            asChild
            color="#2563EB"
            fontWeight="600"
            _hover={{ textDecoration: "underline" }}
          >
            <RouterLink to="/register">
              Register as a doctor
            </RouterLink>
          </ChakraLink>
        </Text>

      </Box>
    </Flex >
  );
}

export default Login;
