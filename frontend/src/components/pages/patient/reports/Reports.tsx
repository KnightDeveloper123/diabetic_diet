import { useCallback, useEffect, useState } from "react";
import { Box, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import useFetch from "../../../hooks/uesFetch";
import { useAuth } from "../../../context/AuthContext";
import { CompareGlucoseChart, GlucoseCarbsScatterChart, GlucoseJourneyChart, TodayGlucoseChart, TodayNutritionRadarChart, WeeklyNutritionRadarChart, WhatIfGlucoseChart, type PythonPlotChart } from "./GlucoseLineChart";

interface ReportCharts {
    today?: PythonPlotChart;
    whatif?: PythonPlotChart;
    compare?: PythonPlotChart;
    journey?: PythonPlotChart;
    scatter?: PythonPlotChart;
    radar_today?: PythonPlotChart;
    radar_week?: PythonPlotChart;
}

interface PythonChartsResponse {
    user?: string;
    whatif_text?: string;
    charts?: ReportCharts;
}

interface ReportData {
    selected_date?: string;
    week_start?: string;
    week_end?: string;
    pythonCharts?: PythonChartsResponse | null;
    // Supports an API that returns the Python response directly.
    user?: string;
    whatif_text?: string;
    charts?: ReportCharts;
}

const getToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000)
        .toISOString()
        .slice(0, 10);
};

const formatDateRange = (start: string, end: string) => {
    const format = (date: string) =>
        new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        });

    return `${format(start)} – ${format(end)}`;
};

const Reports = () => {
    const { user } = useAuth();
    const { loading, error, request } = useFetch<any>();

    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [selectedDate, setSelectedDate] = useState(getToday());

    const fetchReports = useCallback(async () => {
        if (!user?.id) return;

        try {
            const response = await request({
                url: `/api/calculation/reports?userId=${encodeURIComponent(String(user.id))}&date=${encodeURIComponent(selectedDate)}`,
                method: "GET",
            });

            if (response?.status !== 1) {
                setReportData(null);
                return;
            }
            const payload = response?.data ?? response;

            setReportData(payload);
            console.log("Reports API payload:", payload);
            console.log(
                "Python charts:",
                payload?.pythonCharts?.charts ?? payload?.charts
            );
        } catch (err) {
            console.error("Reports API Error:", err);
            setReportData(null);
        }
    }, [request, selectedDate, user?.id]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const pythonCharts =
        reportData?.pythonCharts ??
        (reportData?.charts ? reportData : undefined);

    const charts = pythonCharts?.charts;

    // const hasCharts = Boolean(
    //     charts &&
    //     Object.values(charts).some(
    //         (chart) => chart && Array.isArray(chart.data) && chart.data.length > 0
    //     )
    // );

    return (
        <Box minH="100vh">
            <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                flexWrap="wrap"
                gap={3}
                mb={5}
            >
                <Box>
                    <Text fontSize="lg" fontWeight="700" color="gray.800">
                        Reports
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        {reportData ? `Week of ${formatDateRange(reportData?.week_start || "", reportData?.week_end || "")}` : "Your weekly nutrition reports"}
                    </Text>
                </Box>

                <Input
                    type="date"
                    value={selectedDate}
                    max={getToday()}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    size="sm"
                    width="170px"
                    borderColor="gray.200"
                />
            </Flex>

            {loading && (
                <Flex justify="center" align="center" py={10}>
                    <Spinner color="teal.500" />
                    <Text ml={3} fontSize="sm" color="gray.500">
                        Loading reports...
                    </Text>
                </Flex>
            )}

            {!loading && error && (
                <Text color="red.500" fontSize="sm" mb={4}>
                    {error}
                </Text>
            )}

            <Flex direction="column" gap={5} width="100%">
                {charts?.today && <TodayGlucoseChart chart={charts.today} />}
                {charts?.whatif && <WhatIfGlucoseChart chart={charts.whatif} />}
                {charts?.compare && <CompareGlucoseChart chart={charts.compare} />}
                {charts?.journey && <GlucoseJourneyChart chart={charts.journey} />}
                {charts?.scatter && <GlucoseCarbsScatterChart chart={charts.scatter} />}
                {charts?.radar_today && (
                    <TodayNutritionRadarChart chart={charts.radar_today} />
                )}
                {charts?.radar_week && (
                    <WeeklyNutritionRadarChart chart={charts?.radar_week} />
                )}
            </Flex>


        </Box>
    );
};

export default Reports;
