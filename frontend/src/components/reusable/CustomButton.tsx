import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
    children: ReactNode;
    disabled?: boolean;
}

const CustomButton = ({
    children,
    disabled = false,
    ...props
}: CustomButtonProps) => {
    return (
        <Button
            size="sm"
            borderRadius="7px"
            bg={disabled ? "gray.400" : "#31B0E6"}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    );
};

export default CustomButton;