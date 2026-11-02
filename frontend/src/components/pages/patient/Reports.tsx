
import { Badge, Box, Flex, Text } from "@chakra-ui/react";

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

                    <Box
                        display="inline-block"
                        bg="#E5F4EC"
                        color="#16834B"
                        px={1.5}
                        py={0.5}
                        borderRadius="20px"
                        fontSize="9px"
                        mt={1}
                    >
                        ✓ Within threshold
                    </Box>

                    <Text fontSize="10px" color="#64748B" mt={1}>
                        Threshold 200 g
                    </Text>
                </Box>

                {/* ABOVE THRESHOLD */}
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

                    <Box
                        display="inline-block"
                        bg="#FDECEC"
                        color="#B42318"
                        px={1.5}
                        py={0.5}
                        borderRadius="20px"
                        fontSize="9px"
                        mt={1}
                    >
                        ⚠ Above threshold
                    </Box>
                </Box>
            </Box>

            {/* WEEKLY MEAL GRAPH */}
            <Box
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="9px"
                p={{ base: 3, md: 4 }}
                mb={4}
                boxShadow="0 1px 2px rgba(0,0,0,0.03)"
            >
                <Flex
                    justify="space-between"
                    align={{ base: "flex-start", sm: "center" }}
                    gap={2}
                    mb={4}
                >
                    <Box>
                        <Text
                            fontSize="13px"
                            fontWeight="700"
                            color="#1E293B"
                        >
                            Weekly meal graph
                        </Text>

                        <Text fontSize="10px" color="#64748B" mt={1}>
                            19–25 Oct 2026 · Carbohydrates per day (g)
                        </Text>
                    </Box>

                    <Box
                        bg="#EEF1F6"
                        color="#475569"
                        px={2}
                        py={1}
                        borderRadius="20px"
                        fontSize="9px"
                        whiteSpace="nowrap"
                    >
                        ⓘ Illustrative data
                    </Box>
                </Flex>

                {/* CHART */}
                <Box
                    display="flex"
                    h="155px"
                    mt={3}
                    mb={2}
                    overflow="hidden"
                >
                    {/* Y AXIS */}
                    <Flex
                        direction="column"
                        justify="space-between"
                        align="flex-end"
                        pr={2}
                        pb="23px"
                        w="27px"
                        flexShrink={0}
                    >
                        {[300, 225, 150, 75, 0].map((value) => (
                            <Text
                                key={value}
                                fontSize="9px"
                                color="#475569"
                                lineHeight="1"
                            >
                                {value}
                            </Text>
                        ))}
                    </Flex>

                    {/* CHART AREA */}
                    <Box flex="1" position="relative" pb="23px">
                        {/* GRID LINES */}
                        {[0, 25, 50, 75, 100].map((position) => (
                            <Box
                                key={position}
                                position="absolute"
                                left={0}
                                right={0}
                                top={`${position}%`}
                                borderTop="1px solid #E8EDF3"
                            />
                        ))}

                        {/* THRESHOLD LINE */}
                        <Box
                            position="absolute"
                            top={`${(1 - threshold / 300) * 100}%`}
                            left={0}
                            right={0}
                            borderTop="1.5px dashed #DC2626"
                            zIndex={2}
                        />

                        {/* BARS */}
                        <Flex
                            position="absolute"
                            inset={0}
                            align="stretch"
                            justify="space-around"
                            zIndex={3}
                        >
                            {weeklyData.map((item) => {
                                const isAbove = item.value > threshold;

                                return (
                                    <Flex
                                        key={item.day}
                                        direction="column"
                                        align="center"
                                        justify="flex-end"
                                        flex="1"
                                        position="relative"
                                        minW={0}
                                    >
                                        {/* VALUE LABEL */}
                                        <Text
                                            position="absolute"
                                            bottom={`${(item.value / 300) * 100}%`}
                                            transform="translateY(-5px)"
                                            fontSize="9px"
                                            fontWeight="700"
                                            color={isAbove ? "#B42318" : "#334155"}
                                            whiteSpace="nowrap"
                                        >
                                            {isAbove ? "▲ " : ""}
                                            {item.value}
                                        </Text>

                                        {/* BAR */}
                                        <Box
                                            w={{ base: "55%", sm: "45%" }}
                                            maxW="26px"
                                            h={`${(item.value / 300) * 100}%`}
                                            bg={isAbove ? "#B42318" : "#2463B8"}
                                            borderRadius="3px 3px 0 0"
                                        />
                                    </Flex>
                                );
                            })}
                        </Flex>

                        {/* X AXIS LABELS */}
                        <Flex
                            position="absolute"
                            bottom={0}
                            left={0}
                            right={0}
                            justify="space-around"
                        >
                            {weeklyData.map((item) => (
                                <Flex
                                    key={item.day}
                                    flex="1"
                                    direction="column"
                                    align="center"
                                >
                                    <Text
                                        fontSize="9px"
                                        fontWeight="600"
                                        color="#475569"
                                    >
                                        {item.day}
                                    </Text>
                                    <Text fontSize="9px" color="#64748B">
                                        {item.date}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                </Box>

                {/* CHART LEGEND */}
                <Flex
                    wrap="wrap"
                    gap={{ base: 2, md: 4 }}
                    mt={4}
                    align="center"
                >
                    <Flex align="center" gap={1}>
                        <Box w="8px" h="8px" bg="#2463B8" borderRadius="2px" />
                        <Text fontSize="9px" color="#475569">
                            Within threshold
                        </Text>
                    </Flex>

                    <Flex align="center" gap={1}>
                        <Box w="8px" h="8px" bg="#B42318" borderRadius="2px" />
                        <Text fontSize="9px" color="#475569">
                            Above threshold
                        </Text>
                    </Flex>

                    <Flex align="center" gap={1}>
                        <Box w="12px" borderTop="1.5px dashed #DC2626" />
                        <Text fontSize="9px" color="#475569">
                            Threshold (200 g)
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            {/* AI ANALYSIS TABLE */}
            <Box
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="9px"
                overflow="hidden"
                boxShadow="0 1px 2px rgba(0,0,0,0.03)"
            >
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
                                    item.carbs > 60;

                                return (
                                    <Box
                                        as="tr"
                                        key={index}
                                        borderBottom="1px solid #E2E8F0"
                                        _last={{ borderBottom: "none" }}
                                        _hover={{ bg: "#F8FAFC" }}
                                    >
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

                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="10px"
                                            color="#334155"
                                        >
                                            {item.meal}
                                        </Box>

                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="10px"
                                            color="#334155"
                                        >
                                            {item.items}
                                        </Box>

                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            fontSize="10px"
                                            color="#334155"
                                            whiteSpace="nowrap"
                                            textAlign="center"
                                        >
                                            {item.carbs} g
                                        </Box>

                                        <Box
                                            as="td"
                                            px={1.5}
                                            py={2}
                                            whiteSpace="nowrap"
                                        >
                                            <Badge
                                                colorPalette={isAbove ? "red" : "green"}
                                                variant="subtle"
                                                borderRadius="full"
                                                px={2}
                                                py={1}
                                                fontSize="9px"
                                            >
                                                {isAbove ? "⚠ Above threshold" : "✓ Within threshold"}
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
