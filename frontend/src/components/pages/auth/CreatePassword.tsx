import { useState } from "react";
import { Box, Text, Button, Input, Field } from "@chakra-ui/react";

// type FormData = {
//     password: string;
//     confirmPassword: string;
// };

function CreatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleSubmit = (event: any) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setSuccess("Password validated successfully");
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

                <Box as="form" onSubmit={handleSubmit}>
                    <Field.Root mb={4}>
                        <Field.Label>Password</Field.Label>
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root mb={6}>
                        <Field.Label>Confirm Password</Field.Label>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
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
                        _hover={{ bg: "#2596c7" }}
                    >
                        Create Password
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CreatePassword;