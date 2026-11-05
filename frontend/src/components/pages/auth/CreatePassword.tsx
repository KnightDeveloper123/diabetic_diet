
import { useState } from "react";
import {
    Box,
    Text,
    Button,
    Input,
    Field,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/uesFetch";

function CreatePassword() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const { loading, request } = useFetch<any>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                url: "/api/user/set-password",
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
                    <Field.Root mb={4}>
                        <Field.Label>Password</Field.Label>
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            minLength={8}
                        />
                    </Field.Root>

                    <Field.Root mb={6}>
                        <Field.Label>Confirm Password</Field.Label>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                            minLength={8}
                        />
                    </Field.Root>

                    {error && (
                        <Text color="red.500" fontSize="sm" mb={4}>
                            {error}
                        </Text>
                    )}

                    {success && (
                        <Text color="green.600" fontSize="sm" mb={4}>
                            {success}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        w="100%"
                        h="52px"
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
