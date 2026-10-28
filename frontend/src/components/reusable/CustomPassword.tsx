import { useState } from "react";
import {
    Box,
    Input,
    InputGroup,
    IconButton,
} from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface CustomPasswordProps extends Omit<InputProps, "value" | "onChange" | "type"> {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
}

const CustomPassword = ({
    value,
    onChange,
    placeholder = "Enter password",
    name = "password",
    ...props
}: CustomPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box w="100%">
            <InputGroup
                endElement={
                    <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                    >
                        {showPassword ? <LuEyeOff /> : <LuEye />}
                    </IconButton>
                }
            >
                <Input
                    {...props}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </InputGroup>
        </Box>
    );
};

export default CustomPassword;