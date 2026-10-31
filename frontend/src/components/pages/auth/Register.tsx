
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
    Image,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { FaGgCircle } from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";

import loginImage from "../../../assets/Login.png";

interface RegisterForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    confirmPassword: string;
}

function Register() {
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
            bg="#FFFFFF"
            align="stretch"
            direction={{ base: "column", lg: "row" }}
        >
            {/* LEFT SIDE - IMAGE AND CONTENT */}
            <Box
                w={{ base: "100%", lg: "50%" }}
                minH={{ base: "420px", md: "480px", lg: "100vh" }}
                position="relative"
                overflow="hidden"
                bg="#123D86"
                color="white"
            >
                {/* Background Image */}
                <Image
                    src={loginImage}
                    alt="Diabetic Diet Assistant"
                    position="absolute"
                    inset={0}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                    zIndex={0}
                />

                {/* Blue Overlay */}
                <Box
                    position="absolute"
                    inset={0}
                    bg="rgba(13, 48, 105, 0.55)"
                />

                {/* Image Content */}
                <Flex
                    position="relative"
                    zIndex={1}
                    direction="column"
                    justify="flex-start"
                    minH={{ base: "420px", md: "480px", lg: "100vh" }}
                    p={{
                        base: 6,
                        sm: 8,
                        md: 10,
                        lg: 12,
                        xl: 14,
                    }}
                >
                    {/* Logo */}
                    <Flex align="center" gap={3} mt="1px">
                        <FaGgCircle size={38} color="white" />

                        <Box>
                            <Text
                                fontSize={{ base: "19px", md: "22px" }}
                                fontWeight="700"
                                color="white"
                                lineHeight="1.2"
                                fontFamily="sans-serif"
                            >
                                Diabetic Diet
                            </Text>

                            <Text
                                fontSize="14px"
                                color="rgba(255,255,255,0.75)"
                                mt={1}
                                fontFamily="sans-serif"
                            >
                                Assistant
                            </Text>
                        </Box>
                    </Flex>

                    {/* Main Image Content */}
                    <Box
                        maxW="500px"
                        mt={{ base: 6, md: 10, lg: 16 }}
                    >
                        <Heading
                            as="h1"
                            fontSize={{
                                base: "32px",
                                sm: "38px",
                                md: "44px",
                                lg: "48px",
                                xl: "54px",
                            }}
                            fontWeight="450"
                            color="white"
                            lineHeight="1"
                            mb={5}
                            fontFamily="sans-serif"
                        >
                            Understand Every Meal.
                        </Heading>

                        <Text
                            fontSize={{
                                base: "14px",
                                md: "15px",
                                lg: "16px",
                            }}
                            color="rgba(255,255,255,0.88)"
                            fontFamily="sans-serif"
                        >
                            Photograph a meal to see estimated foods,
                            portions and nutrition, follow your patterns
                            over time, and share progress with your care team.
                        </Text>
                    </Box>

                    {/* Healthcare Disclaimer */}
                    <Text
                        fontSize="12px"
                        color="rgba(255,255,255,0.75)"
                        lineHeight="1.7"
                        maxW="480px"
                        mt="auto"
                        transform="translateY(20px)"
                        fontFamily="sans-serif"
                    >
                        Estimates support - never replace - advice from a
                        qualified healthcare professional.
                    </Text>
                </Flex>
            </Box>

            {/* RIGHT SIDE - REGISTER FORM */}
            <Flex
                w={{ base: "100%", lg: "50%" }}
                minH={{ base: "auto", lg: "100vh" }}
                align="center"
                justify="center"
                px={{ base: 5, sm: 8, md: 12, lg: 10, xl: 16 }}
                py={{ base: 8, md: 10 }}
                bg="#FFFFFF"
            >
                <Box
                    w="100%"
                    maxW="440px"
                >
                    {/* Register Heading */}
                    <Box mb={7}>
                        <Box color="#15803D" mb={4}>
                            <Text
                                fontSize="13px"
                                fontWeight="600"
                            >
                                DOCTOR ACCESS
                            </Text>
                        </Box>

                        <Heading
                            as="h2"
                            textAlign="left"
                            fontSize={{ base: "28px", sm: "32px" }}
                            fontWeight="700"
                            color="#111111"
                            mb={2}
                        >
                            Create your doctor account
                        </Heading>

                        <Text
                            textAlign="left"
                            fontSize={{ base: "13px", sm: "14px" }}
                            color="#6B7280"
                            lineHeight="1.6"
                        >
                            Register to add patients and review their meal reports.
                        </Text>
                    </Box>

                    {/* Register Form */}
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
                                    placeholder="9820012345"
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
                                    px={3}
                                    py={3}
                                    fontSize="14px"
                                    color="#111827"
                                    border="1px solid"
                                    borderColor="#D1D5DB"
                                    borderRadius="7px"
                                    resize="vertical"
                                    _placeholder={{ color: "#9CA3AF" }}
                                    _hover={{ borderColor: "#9CA3AF" }}
                                    _focusVisible={{
                                        borderColor: "#2563EB",
                                        boxShadow: "0 0 0 1px #2563EB",
                                    }}
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
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        _hover={{ bg: "transparent" }}
                                    >
                                        {showPassword
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />
                                        }
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
                                        onClick={() =>
                                            setShowConfirmPassword((prev) => !prev)
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                        _hover={{ bg: "transparent" }}
                                    >
                                        {showConfirmPassword
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />
                                        }
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
                        textAlign="center"
                        mt={7}
                        fontSize={{ base: "12px", sm: "13px" }}
                        color="#6B7280"
                        lineHeight="1.8"
                    >
                        Already registered?{" "}
                        <ChakraLink
                            asChild
                            color="#2563EB"
                            fontWeight="600"
                            _hover={{ textDecoration: "underline" }}
                        >
                            <RouterLink to="/login">
                                Log in
                            </RouterLink>
                        </ChakraLink>
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Register;
