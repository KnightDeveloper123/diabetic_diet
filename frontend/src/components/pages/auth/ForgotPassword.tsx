
import { useState } from "react";
import {
    Box,
    Text,
    Button,
    Input,
    Field,
} from "@chakra-ui/react";
import useFetch from "../../hooks/uesFetch";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const { loading, request } = useFetch<any>();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate=useNavigate();

  const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        try {
            const response = await request({
                url: "/api/auth/forgot",
                method: "POST",
                body: {
                    email: email.trim(),
                },
            });

            if (response?.status === 1) {
                setSuccess(
                    response.message ||
                    response.success ||
                    "Password reset link sent successfully. Please check your email."
                );

                setEmail("");
                navigate('/login')
            } else {
                setError(
                    response?.error ||
                    response?.message ||
                    "Unable to send password reset link"
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
            bg="#fff"
            px={4}
        >
            <Box maxW="400px" w="100%" textAlign="center">
                <Text fontSize="30px" fontWeight="500" mb={3}>
                    Forgot your Password?
                </Text>

                <Text fontSize="14px" color="#000" mb={6}>
                    Enter your email address to receive a password reset link.
                </Text>

                <form  onSubmit={handleSubmit}>
                    <Field.Root invalid={!!error}>
                        <Input
                            type="email"
                            placeholder="Enter Email ID"
                            border="1px solid #868686"
                            rounded="10px"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            disabled={loading}
                        />

                        {error && (
                            <Field.ErrorText>
                                {error}
                            </Field.ErrorText>
                        )}
                    </Field.Root>

                    {success && (
                        <Text
                            color="green.600"
                            fontSize="sm"
                            mt={3}
                        >
                            {success}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        w="100%"
                        bg="#31B0E6"
                        color="#fff"
                        _hover={{ bg: "#2596c7" }}
                        size="sm"
                        mt={4}
                        mb={5}
                        loading={loading}
                        disabled={loading}
                    >
                        Send
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
