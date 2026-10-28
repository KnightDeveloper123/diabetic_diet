import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import api from "../../services/api";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (values: LoginForm) => {
  setServerError("");

  try {
    // Dummy login response
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
  } catch (error) {
    setServerError("Login failed. Please try again.");
  }
};
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="xl"
        shadow="md"
        w="full"
        maxW="420px"
      >
        <Heading size="xl" mb={2}>
          Welcome Back
        </Heading>

        <Text color="gray.600" mb={6}>
          Sign in to Diabetic Diet Assistant
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={1}>Email</Text>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm">
                  {errors.email.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={1}>Password</Text>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm">
                  {errors.password.message}
                </Text>
              )}
            </Box>

            {serverError && (
              <Text color="red.500" fontSize="sm">
                {serverError}
              </Text>
            )}

            <Button
              type="submit"
              colorPalette="teal"
              loading={isSubmitting}
              w="full"
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default Login;