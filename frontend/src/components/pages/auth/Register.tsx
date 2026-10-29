
import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Input,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { FaCircleDot } from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";



interface RegisterForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    confirmPassword: string;
}

function Register() {
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>();

    const password = watch("password");

    const onSubmit = async (values: RegisterForm) => {
        setServerError("");

        try {
            // Connect your doctor registration API here.
            console.log("Registration details:", values);

            // Navigate only after successful API registration.
            // Example: navigate("/login");
        } catch {
            setServerError("Registration failed. Please try again.");
        }
    };

    return (
        <Flex
            minH="100vh"
            w="100%"
            bg="#F8FAFC"
            align="center"
            justify="center"
            px={{ base: 4, sm: 6 }}
            py={{ base: 6, md: 10 }}
        >
            <Box
                w="100%"
                maxW="480px"
                bg="white"
                p={{ base: 5, sm: 7, md: 8 }}
                borderRadius="16px"
                border="1px solid"
                borderColor="#F1F5F9"
                boxShadow="0 4px 24px rgba(0, 0, 0, 0.05)"
            >
                {/* App Heading */}
                <Flex
                    align="center"
                    justify="flex-start"
                    gap={2}
                    mb={{ base: 7, md: 8 }}
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

                {/* Doctor Access */}
                <Flex justify="flex-start" mb={4}>
                    <Box
                        bg="#DCFCE7"
                        color="#15803D"
                        px={3}
                        py={1.5}
                        borderRadius="full"
                    >
                        <Text
                            fontSize="11px"
                            fontWeight="600"
                            letterSpacing="1px"
                        >
                            DOCTOR ACCESS
                        </Text>
                    </Box>
                </Flex>

                {/* Heading */}
                <Heading
                    as="h1"
                    fontSize={{ base: "25px", sm: "29px" }}
                    fontWeight="700"
                    color="#111111"
                    mb={2}
                >
                    Create your doctor account
                </Heading>

                <Text
                    fontSize={{ base: "13px", sm: "14px" }}
                    color="#6B7280"
                    lineHeight="1.7"
                    mb={6}
                >
                    Register to add patients and review their meal reports.
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={4} align="stretch">
                        {/* Full Name */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Full name *
                            </Text>

                            <Input
                                placeholder="Dr. Ananya Rao"
                                h="46px"
                                fontSize="14px"
                                borderColor="#D1D5DB"
                                borderRadius="7px"
                                _placeholder={{ color: "#9CA3AF" }}
                                {...register("fullName", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Please enter your full name",
                                    },
                                })}
                            />

                            {errors.fullName && (
                                <Text color="red.500" fontSize="12px" mt={1}>
                                    {errors.fullName.message}
                                </Text>
                            )}
                        </Box>

                        {/* Email */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Email address *
                            </Text>

                            <Input
                                type="email"
                                placeholder="ananya.rao@example.com"
                                h="46px"
                                fontSize="14px"
                                borderColor="#D1D5DB"
                                borderRadius="7px"
                                _placeholder={{ color: "#9CA3AF" }}
                                {...register("email", {
                                    required: "Email address is required",
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

                        {/* Phone */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Phone *
                            </Text>

                            <Input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="98200"
                                h="46px"
                                fontSize="14px"
                                borderColor="#D1D5DB"
                                borderRadius="7px"
                                _placeholder={{ color: "#9CA3AF" }}
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: "Enter a valid 10-digit mobile number",
                                    },
                                })}
                            />

                            <Text color="#9CA3AF" fontSize="12px" mt={1}>
                                Enter a 10-digit mobile number.
                            </Text>

                            {errors.phone && (
                                <Text color="red.500" fontSize="12px" mt={1}>
                                    {errors.phone.message}
                                </Text>
                            )}
                        </Box>

                        {/* Address */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Address *
                            </Text>

                            <Textarea
                                placeholder="Clinic 12, Karve Road, Pune 411004"
                                minH="85px"
                                fontSize="14px"
                                borderColor="#D1D5DB"
                                borderRadius="7px"
                                resize="vertical"
                                _placeholder={{ color: "#9CA3AF" }}
                                {...register("address", {
                                    required: "Address is required",
                                })}
                            />

                            {errors.address && (
                                <Text color="red.500" fontSize="12px" mt={1}>
                                    {errors.address.message}
                                </Text>
                            )}
                        </Box>

                        {/* Password */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Password *
                            </Text>

                            <Box position="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    h="46px"
                                    pr="45px"
                                    fontSize="14px"
                                    borderColor="#D1D5DB"
                                    borderRadius="7px"
                                    _placeholder={{ color: "#9CA3AF" }}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
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

                            <Text color="#9CA3AF" fontSize="12px" mt={1}>
                                At least 8 characters.
                            </Text>

                            {errors.password && (
                                <Text color="red.500" fontSize="12px" mt={1}>
                                    {errors.password.message}
                                </Text>
                            )}
                        </Box>

                        {/* Confirm Password */}
                        <Box>
                            <Text mb={2} fontSize="14px" color="#374151">
                                Confirm password *
                            </Text>

                            <Box position="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    h="46px"
                                    pr="45px"
                                    fontSize="14px"
                                    borderColor="#D1D5DB"
                                    borderRadius="7px"
                                    _placeholder={{ color: "#9CA3AF" }}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match",
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
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    _hover={{ bg: "transparent" }}
                                >
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </IconButton>
                            </Box>

                            {errors.confirmPassword && (
                                <Text color="red.500" fontSize="12px" mt={1}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </Box>

                        {/* Server Error */}
                        {serverError && (
                            <Text color="red.500" fontSize="sm">
                                {serverError}
                            </Text>
                        )}

                        {/* Register Button */}
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
                            Register
                        </Button>
                    </VStack>
                </form>

                {/* Login Link */}
                <Text
                    mt={6}
                    textAlign="left"
                    fontSize={{ base: "12px", sm: "13px" }}
                    color="#6B7280"
                    lineHeight="1.8"
                >
                    Already registered?{" "}
                    <ChakraLink asChild color="#2563EB" fontWeight="medium">
                        <RouterLink to="/login">
                            Log in
                        </RouterLink>
                    </ChakraLink>
                </Text>
            </Box>
        </Flex>
    );
}

export default Register;
