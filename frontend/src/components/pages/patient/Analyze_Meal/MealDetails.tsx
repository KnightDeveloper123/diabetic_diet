
import { useState } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Input,
    HStack,
    Textarea,
} from "@chakra-ui/react";

import {
    FiSun,
    FiCoffee,
    FiActivity,
    FiMoon,
    FiArrowLeft,
    FiZap,
} from "react-icons/fi";

import { useLocation, useNavigate } from "react-router-dom";

const Meal_Details = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mealImage = location.state?.mealImage;

    const [mealType, setMealType] = useState("Lunch");
    const [date, setDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    });

    const [time, setTime] = useState(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    });

    const [description, setDescription] = useState("");
    const [portionInfo, setPortionInfo] = useState("");
    const [demoFailure, setDemoFailure] = useState(false);

    const mealTypes = [
        {
            label: "Breakfast",
            icon: <FiSun size={19} />,
        },
        {
            label: "Lunch",
            icon: <FiCoffee size={19} />,
        },
        {
            label: "Snack",
            icon: <FiActivity size={19} />,
        },
        {
            label: "Dinner",
            icon: <FiMoon size={19} />,
        },
    ];

    const steps = [
        "Upload",
        "Meal details",
        "Analyze",
        "Review results",
    ];

    const handleBack = () => {
        navigate("/patient/analyze-meal", {
            state: { mealImage },
        });
    };

    const handleAnalyze = () => {
        navigate("/patient/analysis", {
            state: {
                mealImage,
                mealType,
                date,
                time,
                description,
                portionInfo,
                demoFailure,
            },
        });
    };

    return (
        <Flex
            minH="100vh"
            bg="#F5F7FB"
            color="#1E293B"
            minW={0}
            fontFamily="Arial, sans-serif"
        >
            <Flex flex="1" direction="column" minW={0}>
                <Box
                    p={{ base: 4, md: 6 }}
                    maxW="1200px"
                    w="100%"
                    mx="auto"
                >
                    {/* PROGRESS STEPS */}
                    <Flex
                        gap={3}
                        mb={6}
                        overflowX="auto"
                        pb={2}
                    >
                        {steps.map((step, index) => (
                            <Box
                                key={step}
                                flex="1"
                                minW="115px"
                            >
                                <Box
                                    h="3px"
                                    bg={
                                        index <= 1
                                            ? "#244A78"
                                            : "#DCE2EA"
                                    }
                                    mb={3}
                                />

                                <HStack gap={2}>
                                    <Flex
                                        w="22px"
                                        h="22px"
                                        flexShrink={0}
                                        borderRadius="full"
                                        border={
                                            index === 1 || index === 0
                                                ? "none"
                                                : "1px solid #B9C4D2"
                                        }
                                        bg={
                                            index === 0
                                                ? "#168A7A"
                                                : index === 1
                                                    ? "#244A78"
                                                    : "transparent"
                                        }
                                        color={
                                            index <= 1
                                                ? "white"
                                                : "#64748B"
                                        }
                                        justify="center"
                                        align="center"
                                        fontSize="12px"
                                        fontWeight="600"
                                    >
                                        {index === 0 ? "✓" : index + 1}
                                    </Flex>

                                    <Text
                                        fontSize="sm"
                                        color={
                                            index === 1
                                                ? "#1E293B"
                                                : "#64748B"
                                        }
                                        fontWeight={
                                            index === 1 ? "700" : "500"
                                        }
                                        whiteSpace="nowrap"
                                    >
                                        {step}
                                    </Text>
                                </HStack>
                            </Box>
                        ))}
                    </Flex>

                    {/* MEAL DETAILS CARD */}
                    <Box
                        bg="white"
                        border="1px solid #E2E8F0"
                        borderRadius="14px"
                        boxShadow="0 2px 5px rgba(0,0,0,0.03)"
                        overflow="hidden"
                    >
                        <Box p={{ base: 4, md: 6 }}>
                            <Text
                                fontSize="lg"
                                fontWeight="700"
                                mb={5}
                                color="#263445"
                            >
                                Meal details
                            </Text>

                            {/* MEAL TYPE */}
                            <Box mb={5}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    mb={3}
                                    color="#334155"
                                >
                                    Meal type
                                </Text>

                                <Flex
                                    border="1px solid #E2E8F0"
                                    borderRadius="12px"
                                    p={2}
                                    gap={2}
                                    wrap="wrap"
                                >
                                    {mealTypes.map((meal) => (
                                        <Button
                                            key={meal.label}
                                            flex="1"
                                            minW="110px"
                                            h="65px"
                                            display="flex"
                                            flexDirection="column"
                                            gap={1}
                                            bg={
                                                mealType === meal.label
                                                    ? "#E8F0FC"
                                                    : "white"
                                            }
                                            color={
                                                mealType === meal.label
                                                    ? "#244A78"
                                                    : "#334155"
                                            }
                                            border={
                                                mealType === meal.label
                                                    ? "2px solid #244A78"
                                                    : "1px solid #CBD5E1"
                                            }
                                            borderRadius="10px"
                                            fontSize="sm"
                                            fontWeight="600"
                                            _hover={{
                                                bg: "#E8F0FC",
                                            }}
                                            onClick={() =>
                                                setMealType(meal.label)
                                            }
                                        >
                                            {meal.icon}
                                            {meal.label}
                                        </Button>
                                    ))}
                                </Flex>
                            </Box>

                            {/* DATE AND TIME */}
                            <Flex
                                gap={4}
                                mb={5}
                                direction={{ base: "column", md: "row" }}
                            >
                                <Box flex="1">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        mb={2}
                                        color="#334155"
                                    >
                                        Date
                                    </Text>

                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        h="46px"
                                        fontSize="md"
                                        borderColor="#BFC9D5"
                                        borderRadius="9px"
                                    />
                                </Box>

                                <Box flex="1">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        mb={2}
                                        color="#334155"
                                    >
                                        Time
                                    </Text>

                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) =>
                                            setTime(e.target.value)
                                        }
                                        h="46px"
                                        fontSize="md"
                                        borderColor="#BFC9D5"
                                        borderRadius="9px"
                                    />
                                </Box>
                            </Flex>

                            {/* DESCRIPTION */}
                            <Box mb={5}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    mb={2}
                                    color="#334155"
                                >
                                    Description{" "}
                                    <Text
                                        as="span"
                                        fontWeight="400"
                                        color="#64748B"
                                    >
                                        (optional)
                                    </Text>
                                </Text>

                                <Textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="e.g. Home-cooked, less oil than usual"
                                    minH="85px"
                                    fontSize="md"
                                    borderColor="#BFC9D5"
                                    borderRadius="9px"
                                    resize="vertical"
                                />
                            </Box>

                            {/* PORTION INFORMATION */}
                            <Box mb={4}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    mb={2}
                                    color="#334155"
                                >
                                    Portion or serving info{" "}
                                    <Text
                                        as="span"
                                        fontWeight="400"
                                        color="#64748B"
                                    >
                                        (optional)
                                    </Text>
                                </Text>

                                <Input
                                    value={portionInfo}
                                    onChange={(e) =>
                                        setPortionInfo(e.target.value)
                                    }
                                    placeholder="e.g. 2 rotis, 1 katori dal"
                                    h="46px"
                                    fontSize="md"
                                    borderColor="#BFC9D5"
                                    borderRadius="9px"
                                />

                                <Text
                                    fontSize="sm"
                                    color="#64748B"
                                    mt={2}
                                >
                                    Helps when portions are hard to see in the photo.
                                </Text>
                            </Box>

                            {/* DEMO CHECKBOX */}
                            <HStack
                                align="flex-start"
                                gap={3}
                                mt={4}
                            >
                                <input
                                    type="checkbox"
                                    checked={demoFailure}
                                    onChange={(e) =>
                                        setDemoFailure(e.target.checked)
                                    }
                                    style={{
                                        width: "17px",
                                        height: "17px",
                                        marginTop: "3px",
                                        cursor: "pointer",
                                    }}
                                />

                                <Box>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="#334155"
                                    >
                                        Demo: simulate an analysis failure
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="#64748B"
                                    >
                                        Shows the error and retry state.
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>

                        {/* CARD FOOTER */}
                        <Flex
                            borderTop="1px solid #E5E7EB"
                            px={{ base: 4, md: 6 }}
                            py={4}
                            align="center"
                            justify="space-between"
                            gap={3}
                            wrap="wrap"
                        >
                            <Button
                                size="md"
                                variant="ghost"
                                color="#334155"
                                fontSize="sm"
                                onClick={handleBack}
                            >
                                <FiArrowLeft size={18} />
                                Back
                            </Button>

                            <Button
                                size="md"
                                bg="#244A78"
                                color="white"
                                fontSize="sm"
                                px={6}
                                _hover={{ bg: "#18395F" }}
                                onClick={handleAnalyze}
                            >
                                <FiZap size={17} />
                                Analyze meal
                            </Button>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Meal_Details;
