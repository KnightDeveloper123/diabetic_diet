import { useState } from "react";
import { Box, Input, InputGroup, IconButton } from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const CustomPassword = ({
    value,
    onChange,
    placeholder = "Enter password",
    name = "password",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box w="100%">
            <InputGroup
                endElement={
                    <IconButton
                        variant="ghost"
                        size="sm"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                }
            >
                <Input
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            </InputGroup>
        </Box>
    );
};

export default CustomPassword;