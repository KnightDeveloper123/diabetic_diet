
import { useEffect, useState } from "react";
import { Badge, Box, Flex, Text, Input, Spinner } from "@chakra-ui/react";
import ThresholdBarGraph from "./ThresholdBarGraph";
import useFetch from "../../../hooks/uesFetch";
import { useAuth } from "../../../context/AuthContext";

interface WeeklyGraphItem {
    date: string;
    day: string;
    value: number;
    carbohydrates: number;
    threshold: number;
    status: string;
}

interface RecentMeal {
    id: string;
    date: string;
    meal: string;
    items: string;
    carbs: number;
    carbohydrates: number;
    calories: number;
    protein: number;
    fats: number;
    fiber: number;
    sugar: number;
    risk_level: string;
    status: string;
}

interface ReportData {
    selected_date: string;
    week_start: string;
    week_end: string;
    summary: {
        meals_recorded: number;
        daily_average: number;
        days_above_threshold: number;
        weekly_total: number;
        daily_threshold: number;
        weekly_threshold: number;
    };
    weekly_graph: WeeklyGraphItem[];
    recent_meals: RecentMeal[];
}

const Reports = () => {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const { loading, request } = useFetch();
    const { user } = useAuth();

    // Fetch Reports API
    const fetchReports = async (date: string) => {
        try {

            if (!user?.id) {
                throw new Error("User authentication required");
            }

            const response = await request({
                url: `/api/calculation/reports?userId=${encodeURIComponent(user.id)}&date=${encodeURIComponent(date)}`,
                method: "GET",
            });

            if (response?.status === 1) {
                setReportData(response.data);
            } else {
                setReportData(null);
            }
        } catch (err) {
            console.error("Reports API Error:", err);
            setReportData(null);
        }
    };

    // Initial API call
    useEffect(() => {
        fetchReports(selectedDate);
    }, []);

    // Date formatting
    const formatDateRange = (start: string, end: string) => {
        const format = (date: string) =>
            new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
            });

        return `${format(start)} – ${format(end)}`;
    };

    // Transform API graph data for ThresholdBarGraph
    const weeklyData =
        reportData?.weekly_graph.map((item) => ({
            day: item.day,
            date: new Date(`${item.date}T00:00:00`).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short" }
            ),
            value: Number(item.carbohydrates) || 0,
        })) || [];

    const summary = reportData?.summary;

    const meals = reportData?.recent_meals || [];

    const threshold = summary?.weekly_threshold ?? 200;

    return (
        <Box minH="100vh">

            {/* PAGE HEADER */}
            <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                flexWrap="wrap"
                gap={3}
                mb={5}
            >
                <Box>
                    <Text
                        fontSize="2xl"
                        fontWeight="700"
                        color="gray.800"
                        mb={2}
                    >
                        Reports
                    </Text>

                    <Text fontSize="sm" color="gray.500">
                        {reportData
                            ? `Week of ${formatDateRange(
                                reportData.week_start,
                                reportData.week_end
                            )}`
                            : "Your weekly nutrition reports"}
                        {" "}· Only you and your doctor can see these reports.
                    </Text>
                </Box>

                {/* DATE FILTER */}
                <Box>
                    <Input
                        type="date"
                        value={selectedDate}
                        max={new Date().toLocaleDateString("en-CA")}
                        onChange={(e) => {
                            const date = e.target.value;
                            setSelectedDate(date);

                            if (date) {
                                fetchReports(date);
                            }
                        }}
                        size="sm"
                        width="170px"
                        borderColor="gray.200"
                    />
                </Box>
            </Flex>

            {/* LOADING */}
            {loading && (
                <Flex justify="center" align="center" py={12}>
                    <Spinner size="lg" color="teal.500" />
                    <Text ml={3} color="gray.500" fontSize="sm">
                        Loading reports...
                    </Text>
                </Flex>
            )}

            {/* ERROR */}
            {/* {!loading && (
                <Box
                    bg="red.50"
                    border="1px solid #FECACA"
                    borderRadius="7px"
                    p={4}
                    mb={4}
                >
                    <Text color="red.600" fontSize="sm">
                        {error}
                    </Text>

                    <Text
                        color="blue.600"
                        fontSize="sm"
                        mt={2}
                        cursor="pointer"
                        onClick={() => fetchReports(selectedDate)}
                    >
                        Retry
                    </Text>
                </Box>
            )} */}

            {/* REPORT CONTENT */}
            {!loading && reportData && (
                <>
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
                            <Text fontSize="sm" color="gray.600" mb={1}>
                                Meals recorded
                            </Text>

                            <Text
                                fontSize="2xl"
                                fontWeight="700"
                                color="gray.800"
                                lineHeight="1.3"
                            >
                                {summary?.meals_recorded ?? 0}
                            </Text>

                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {formatDateRange(
                                    reportData.week_start,
                                    reportData.week_end
                                )}
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
                            <Text fontSize="sm" color="gray.600" mb={1}>
                                Daily average
                            </Text>

                            <Flex align="baseline" gap={1}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="700"
                                    color="gray.800"
                                    lineHeight="1.3"
                                >
                                    {summary?.daily_average ?? 0}
                                </Text>

                                <Text fontSize="sm" color="gray.500">
                                    g
                                </Text>
                            </Flex>

                            <Badge
                                colorPalette={
                                    (summary?.daily_average ?? 0) >
                                        (summary?.daily_threshold ?? 60)
                                        ? "red"
                                        : "green"
                                }
                                variant="subtle"
                                borderRadius="full"
                                px={2}
                                py={1}
                                fontSize="xs"
                                mt={1}
                            >
                                {(summary?.daily_average ?? 0) >
                                    (summary?.daily_threshold ?? 60)
                                    ? "⚠ Above threshold"
                                    : "✓ Within threshold"}
                            </Badge>

                            <Text fontSize="xs" color="gray.500" mt={1}>
                                Daily threshold {summary?.daily_threshold} g
                            </Text>
                        </Box>

                        {/* DAYS ABOVE THRESHOLD */}
                        <Box
                            bg="white"
                            border={
                                (summary?.days_above_threshold ?? 0) > 0
                                    ? "1px solid #DC6B6B"
                                    : "1px solid #E2E8F0"
                            }
                            borderRadius="7px"
                            p={3}
                            minH="101px"
                        >
                            <Text fontSize="sm" color="gray.600" mb={1}>
                                Days above threshold
                            </Text>

                            <Flex align="baseline" gap={1}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="700"
                                    color="gray.800"
                                    lineHeight="1.3"
                                >
                                    {summary?.days_above_threshold ?? 0}
                                </Text>

                                <Text fontSize="sm" color="gray.500">
                                    of 7
                                </Text>
                            </Flex>

                            <Badge
                                colorPalette={
                                    (summary?.days_above_threshold ?? 0) > 0
                                        ? "red"
                                        : "green"
                                }
                                variant="subtle"
                                borderRadius="full"
                                px={2}
                                py={1}
                                fontSize="xs"
                                mt={1}
                            >
                                {(summary?.days_above_threshold ?? 0) > 0
                                    ? "⚠ Above threshold"
                                    : "✓ Within threshold"}
                            </Badge>
                        </Box>
                    </Box>

                    {/* WEEKLY GRAPH */}
                    <ThresholdBarGraph
                        data={weeklyData}
                        threshold={threshold}
                        title="Weekly Carbohydrate Intake"
                        subtitle={`${formatDateRange(
                            reportData.week_start,
                            reportData.week_end
                        )} · Carbohydrates per day (g)`}
                    />

                    {/* AI ANALYSIS TABLE */}
                    <Box
                        bg="white"
                        border="1px solid #E2E8F0"
                        borderRadius="9px"
                        overflow="hidden"
                        boxShadow="0 1px 2px rgba(0,0,0,0.03)"
                        mt={5}
                    >
                        {/* TABLE HEADER */}
                        <Box px={4} py={3}>
                            <Text
                                fontSize="sm"
                                fontWeight="700"
                                color="gray.800"
                            >
                                AI analysis results
                            </Text>

                            <Text fontSize="xs" color="gray.500" mt={1}>
                                Most recent meals
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
                                <Box as="thead" bg="gray.50">
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
                                                px={2}
                                                py={2}
                                                fontSize="xs"
                                                fontWeight="700"
                                                color="gray.600"
                                                whiteSpace="nowrap"
                                            >
                                                {heading}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Box as="tbody">
                                    {meals.length > 0 ? (
                                        meals.map((item) => {
                                            const isAbove =
                                                item.status ===
                                                "Above threshold";

                                            return (
                                                <Box
                                                    as="tr"
                                                    key={item.id}
                                                    borderBottom="1px solid #E2E8F0"
                                                    _last={{
                                                        borderBottom: "none",
                                                    }}
                                                    _hover={{ bg: "gray.50" }}
                                                >
                                                    {/* DATE */}
                                                    <Box
                                                        as="td"
                                                        px={2}
                                                        py={2}
                                                        fontSize="xs"
                                                        color="gray.700"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {item.date.replace(
                                                            /,\s*null$/,
                                                            ""
                                                        )}
                                                    </Box>

                                                    {/* MEAL */}
                                                    <Box
                                                        as="td"
                                                        px={2}
                                                        py={2}
                                                        fontSize="xs"
                                                        color="gray.700"
                                                    >
                                                        {item.meal || "-"}
                                                    </Box>

                                                    {/* DETECTED ITEMS */}
                                                    <Box
                                                        as="td"
                                                        px={2}
                                                        py={2}
                                                        fontSize="sm"
                                                        color="gray.700"
                                                        maxW="300px"
                                                    >
                                                        {item.items || "-"}
                                                    </Box>

                                                    {/* CARBOHYDRATES */}
                                                    <Box
                                                        as="td"
                                                        px={2}
                                                        py={2}
                                                        fontSize="sm"
                                                        color="gray.700"
                                                        whiteSpace="nowrap"
                                                        textAlign="center"
                                                    >
                                                        {item.carbohydrates} g
                                                    </Box>

                                                    {/* STATUS */}
                                                    <Box
                                                        as="td"
                                                        px={2}
                                                        py={2}
                                                        whiteSpace="nowrap"
                                                    >
                                                        <Badge
                                                            colorPalette={
                                                                isAbove
                                                                    ? "red"
                                                                    : "green"
                                                            }
                                                            variant="subtle"
                                                            borderRadius="full"
                                                            px={2}
                                                            py={1}
                                                            fontSize="xs"
                                                        >
                                                            {isAbove
                                                                ? "⚠ Above threshold"
                                                                : "✓ Within threshold"}
                                                        </Badge>
                                                    </Box>
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Box as="tr">
                                            <Box
                                                as="td"
                                                // colSpan={5}
                                                textAlign="center"
                                                py={8}
                                            >
                                                <Text
                                                    color="gray.500"
                                                    fontSize="sm"
                                                >
                                                    No meals recorded for this week.
                                                </Text>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Reports;
