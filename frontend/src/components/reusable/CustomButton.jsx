import { Button } from '@chakra-ui/react'
import React from 'react'

const CustomButton = ({ children, disabled = false, ...props }) => {
    return (
        <Button
            size={'sm'}
            // flex={1}
            borderRadius={'7px'}
            bgColor={disabled ? "gray.400" : "#31B0E6"}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    )
}

export default CustomButton