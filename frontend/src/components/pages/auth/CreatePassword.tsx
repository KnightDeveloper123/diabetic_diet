
import { useState } from "react";
import {
    Box,
    Text,
    Button,
    Input,
    Field,
    IconButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/uesFetch";
import { FiEye, FiEyeOff } from "react-icons/fi";

function CreatePassword() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const { loading, request } = useFetch<any>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing password reset token");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await request({
                url: "/api/auth/set-password",
                method: "POST",
                body: {
                    token,
                    password,
                    confirm_password: confirmPassword,
                },
            });

            if (response?.status === 1) {
                setSuccess(
                    response.success || "Password created successfully"
                );

                setPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            } else {
                setError(
                    response?.error ||
                    response?.message ||
                    "Unable to create password"
                );
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.error ||
                err?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="#EAF8FF"
            px={4}
        >
            <Box
                maxW="420px"
                w="100%"
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="md"
            >
                <Text fontSize="32px" fontWeight="600" mb={3}>
                    Create Password
                </Text>

                <Text fontSize="14px" color="#666" mb={6}>
                    Set a new secure password
                </Text>

                <form onSubmit={handleSubmit}>
                    {/* Password */}
                    <Field.Root mb={4} >
                        <Field.Label>Password</Field.Label>

                        <Box position="relative" w='100%'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                // h="46px"
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
                                required
                                minLength={8}
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
                                    setShowPassword((prev) => !prev)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                _hover={{ bg: "transparent" }}
                            >
                                {showPassword
                                    ? <FiEyeOff size={18} />
                                    : <FiEye size={18} />
                                }
                            </IconButton>
                        </Box>
                    </Field.Root>

                    {/* Confirm Password */}
                    <Field.Root mb={6}>
                        <Field.Label>Confirm Password</Field.Label>

                        <Box position="relative" w='100%'>
                            <Input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                // h="46px"
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
                                required
                                minLength={8}
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
                    </Field.Root>

                    {/* Error Message */}
                    {error && (
                        <Text color="red.500" fontSize="sm" mb={4}>
                            {error}
                        </Text>
                    )}

                    {/* Success Message */}
                    {success && (
                        <Text color="green.600" fontSize="sm" mb={4}>
                            {success}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        w="100%"
                        // h="52px"
                        bg="#31B0E6"
                        color="white"
                        loading={loading}
                        disabled={loading || !token}
                        _hover={{ bg: "#2596c7" }}
                    >
                        Create Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default CreatePassword;
