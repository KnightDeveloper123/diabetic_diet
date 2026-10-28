
import {
    Box,
    Dialog,
    Flex,
    Icon,
    Portal,
    Text,
} from "@chakra-ui/react";

import { CiViewList } from "react-icons/ci";

const CustomDialog = ({
    children,
    header,
    subtitle,
    isOpen = false,
    setisOpen,
    TrigerButton,
    size = "md",
    icon,
    action,
    subtitleColor = "#535353",
    isPdf,
    contentProps = {},
    triggerbuttonPops = {},
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => setisOpen?.(e.open)}
            placement="center"
            closeOnInteractOutside={true}
            size={size}
        >
            {/* Trigger Button */}
            <Box
                onClick={() => setisOpen?.(true)}
                {...triggerbuttonPops}
                display="inline-block"
                cursor="pointer"
            >
                {TrigerButton}
            </Box>

            <Portal>
                <Dialog.Backdrop
                    bg="rgba(0,0,0,0.45)"
                    backdropFilter="blur(4px)"
                />

                <Dialog.Positioner p={4}>
                    <Dialog.Content
                        bg="white"
                        borderRadius="10px"
                        overflow="hidden"
                        boxShadow="0px 20px 60px rgba(0,0,0,0.15)"
                        {...contentProps}
                    >
                        {header && (
                            <Dialog.Header px={6}>
                                <Flex justify="space-between" align="center" w="100%">
                                    <Flex align="center" gap={2}>
                                        {icon === "none" ? null : (
                                            <Box bg="#D9D9D933" p={1} borderRadius={5}>
                                                {!isPdf &&
                                                    (icon ? (
                                                        <Icon boxSize={8} color="#31B0E6">
                                                            {icon}
                                                        </Icon>
                                                    ) : (
                                                        <CiViewList
                                                            size={25}
                                                            color="#31B0E6"
                                                        />
                                                    ))}
                                            </Box>
                                        )}

                                        <Box>
                                            <Dialog.Title
                                                fontWeight="600"
                                                fontSize={{
                                                    base: "16px",
                                                    sm: "18px",
                                                    md: "22px",
                                                }}
                                                color="black"
                                            >
                                                {header}
                                            </Dialog.Title>

                                            {subtitle && (
                                                <Text
                                                    fontSize={{
                                                        base: "13px",
                                                        sm: "13px",
                                                        md: "15px",
                                                    }}
                                                    color={subtitleColor}
                                                >
                                                    {subtitle}
                                                </Text>
                                            )}
                                        </Box>
                                    </Flex>

                                    {action}
                                </Flex>
                            </Dialog.Header>
                        )}

                        <Dialog.Body px={6} color="black">
                            {children}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CustomDialog;
