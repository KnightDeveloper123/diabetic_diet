
import { useState } from "react";
import { Box, Text, Button, Input, Field } from "@chakra-ui/react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter valid email");
            return;
        }

        setSuccess("Email validated successfully");
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

                <Box as="form" onSubmit={handleSubmit}>
                    <Field.Root invalid={!!error}>
                        <Input
                            type="email"
                            placeholder="Enter Email ID"
                            border="1px solid #868686"
                            rounded="10px"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        {error && <Field.ErrorText>{error}</Field.ErrorText>}
                    </Field.Root>

                    {success && (
                        <Text color="green.600" fontSize="sm" mt={3}>
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
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
