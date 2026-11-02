
import { Badge, Box, Flex, Text } from "@chakra-ui/react";

import ThresholdBarGraph from "./ThresholdBarGraph";

const weeklyData = [
    { day: "Mon", date: "19 Oct", value: 168 },
    { day: "Tue", date: "20 Oct", value: 182 },
    { day: "Wed", date: "21 Oct", value: 154 },
    { day: "Thu", date: "22 Oct", value: 213 },
    { day: "Fri", date: "23 Oct", value: 171 },
    { day: "Sat", date: "24 Oct", value: 229 },
    { day: "Sun", date: "25 Oct", value: 160 },
];

const meals = [
    {
        date: "Tue 27 Oct, 13:05",
        meal: "Lunch",
        items: "Rice, dal, mixed vegetables",
        carbs: 62,
        status: "Above threshold",
    },
    {
        date: "Tue 27 Oct, 08:10",
        meal: "Breakfast",
        items: "Poha, tea",
        carbs: 38,
        status: "Within threshold",
    },
    {
        date: "Mon 26 Oct, 20:15",
        meal: "Dinner",
        items: "Chapati, paneer, salad",
        carbs: 51,
        status: "Within threshold",
    },
    {
        date: "Mon 26 Oct, 13:20",
        meal: "Lunch",
        items: "Curd rice, pickle",
        carbs: 58,
        status: "Within threshold",
    },
];

const threshold = 200;

const Reports = () => {
    const mealsRecorded = 21;
    const dailyAverage = 182;

    const daysAboveThreshold = weeklyData.filter(
        (item) => item.value > threshold
    ).length;

    return (
        <Box minH="100vh">

            {/* PAGE HEADER */}
            <Box mb={5}>
                <Text
                    fontSize="18px"
                    fontWeight="700"
                    color="#1E293B"
                    mb={2}
                >
                    Reports
                </Text>

                <Text fontSize="12px" color="#64748B">
                    Week of 19–25 Oct 2026 · Only you and your doctor can see these reports.
                </Text>
            </Box>

            {/* SUMMARY CARDS */}
            <Box
                display="grid"
                gridTemplateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                }}
                gap={3}
                mb={4}
            >

                {/* MEALS RECORDED */}
                <Box
                    bg="white"
                    border="1px solid #E2E8F0"
                    borderRadius="7px"
                    p={3}
                    minH="101px"
                >
                    <Text fontSize="11px" color="#475569" mb={1}>
                        Meals recorded
                    </Text>

                    <Text
                        fontSize="23px"
                        fontWeight="700"
                        color="#1E293B"
                        lineHeight="1.3"
                    >
                        {mealsRecorded}
                    </Text>

                    <Text fontSize="10px" color="#64748B" mt={1}>
                        19–25 Oct 2026
                    </Text>
                </Box>

                {/* DAILY AVERAGE */}
                <Box
                    bg="white"
                    border="1px solid #E2E8F0"
                    borderRadius="7px"
                    p={3}
                    minH="101px"
                >
                    <Text fontSize="11px" color="#475569" mb={1}>
                        Daily average
                    </Text>

                    <Flex align="baseline" gap={1}>
                        <Text
                            fontSize="23px"
                            fontWeight="700"
                            color="#1E293B"
                            lineHeight="1.3"
                        >
                            {dailyAverage}
                        </Text>

                        <Text fontSize="11px" color="#64748B">
                            g
                        </Text>
                    </Flex>

                    <Badge
                        colorPalette="green"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="9px"
                        mt={1}
                    >
                        ✓ Within threshold
                    </Badge>

                    <Text fontSize="10px" color="#64748B" mt={1}>
                        Threshold 200 g
                    </Text>
                </Box>

                {/* DAYS ABOVE THRESHOLD */}
                <Box
                    bg="white"
                    border="1px solid #DC6B6B"
                    borderRadius="7px"
                    p={3}
                    minH="101px"
                >
                    <Text fontSize="11px" color="#475569" mb={1}>
                        Days above threshold
                    </Text>

                    <Flex align="baseline" gap={1}>
                        <Text
                            fontSize="23px"
                            fontWeight="700"
                            color="#1E293B"
                            lineHeight="1.3"
                        >
                            {daysAboveThreshold}
                        </Text>

                        <Text fontSize="11px" color="#64748B">
                            of 7
                        </Text>
                    </Flex>

                    <Badge
                        colorPalette="red"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="9px"
                        mt={1}
                    >
                        ⚠ Above threshold
                    </Badge>
                </Box>
            </Box>

            <ThresholdBarGraph
                data={weeklyData}
                threshold={threshold}
                title="Weekly Carbohydrate Intake"
                subtitle="19–25 Oct 2026 · Carbohydrates per day (g)"
            />

            {/* AI ANALYSIS TABLE */}
            <Box
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="9px"
                overflow="hidden"
                boxShadow="0 1px 2px rgba(0,0,0,0.03)"
            >
                {/* TABLE HEADER */}
                <Box px={4} py={3}>
                    <Text
                        fontSize="13px"
                        fontWeight="700"
                        color="#1E293B"
                    >
                        AI analysis results
                    </Text>

                    <Text fontSize="10px" color="#64748B" mt={1}>
                        Most recent meals · illustrative sample
                    </Text>
                </Box>

                {/* TABLE */}
                <Box overflowX="auto">
                    <Box
                        as="table"
                        w="100%"
                        minW="650px"
                        borderCollapse="collapse"
                    >
                        <Box as="thead" bg="#EEF1F6">
                            <Box as="tr">
                                {[
                                    "DATE AND TIME",
                                    "MEAL",
                                    "DETECTED ITEMS",
                                    "CARBOHYDRATES",
                                    "STATUS",
                                ].map((heading) => (
                                    <Box
                                        as="th"
                                        key={heading}
                                        textAlign="left"
                                        px={1.5}
                                        py={2}
                                        fontSize="9px"
                                        fontWeight="700"
                                        color="#475569"
                                        whiteSpace="nowrap"
                                    >
                                        {heading}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box as="tbody">
                            {meals.map((item, index) => {
                                const isAbove =
                                    item.status === "Above threshold";

                                return (
                                    <Box
                                        as="tr"
                                        key={index}
                                        borderBottom="1px solid #E2E8F0"
                                        _last={{ borderBottom: "none" }}
                                        _hover={{ bg: "#F8FAFC" }}
                                    >
                                        {/* DATE */}
                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="10px"
                                            color="#334155"
                                            whiteSpace="nowrap"
                                        >
                                            {item.date}
                                        </Box>

                                        {/* MEAL */}
                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="10px"
                                            color="#334155"
                                        >
                                            {item.meal}
                                        </Box>

                                        {/* DETECTED ITEMS */}
                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="12px"
                                            color="#334155"
                                        >
                                            {item.items}
                                        </Box>

                                        {/* CARBOHYDRATES */}
                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="12px"
                                            color="#334155"
                                            whiteSpace="nowrap"
                                            textAlign="center"
                                        >
                                            {item.carbs} g
                                        </Box>

                                        {/* STATUS BADGE */}
                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            whiteSpace="nowrap"
                                        >
                                            <Badge
                                                colorPalette={
                                                    isAbove ? "red" : "green"
                                                }
                                                variant="subtle"
                                                borderRadius="full"
                                                px={2}
                                                py={1}
                                                fontSize="12px"
                                            >
                                                {isAbove
                                                    ? "⚠ Above threshold"
                                                    : "✓ Within threshold"}
                                            </Badge>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Reports;
