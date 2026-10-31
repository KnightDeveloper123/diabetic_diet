
"use client";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type Chart,
    type ChartOptions,
    type TooltipItem,
    type Plugin,
} from "chart.js";

import { Box, Flex, HStack, Text } from "@chakra-ui/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Weekly meal data type
type WeeklyMeal = {
    day: string;
    date: string;
    carbs: number;
};

// Component props type
type WeeklyMealChartProps = {
    data?: WeeklyMeal[];
};

// Custom plugin for threshold line and values
const customLabels: Plugin<"bar"> = {
    id: "customLabels",

    afterDatasetsDraw(chart: Chart<"bar">) {
        const {
            ctx,
            scales: { x, y },
        } = chart;

        // Threshold line
        const thresholdY = y.getPixelForValue(200);

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "#DC2626";
        ctx.lineWidth = 2;
        ctx.moveTo(x.left, thresholdY);
        ctx.lineTo(x.right, thresholdY);
        ctx.stroke();
        ctx.restore();

        // Values above bars
        const meta = chart.getDatasetMeta(0);

        meta.data.forEach((bar:any, index:any) => {
            const value = chart.data.datasets[0].data[index];

            if (typeof value !== "number") return;

            ctx.save();
            ctx.font = "600 12px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = value > 200 ? "#B42318" : "#334155";

            ctx.fillText(String(value), bar.x, bar.y - 8);

            ctx.restore();
        });
    },
};

const WeeklyMealChart = ({ data }: WeeklyMealChartProps) => {
    const weeklyData: WeeklyMeal[] = data || [
        { day: "Mon", date: "19 Oct", carbs: 168 },
        { day: "Tue", date: "20 Oct", carbs: 182 },
        { day: "Wed", date: "21 Oct", carbs: 154 },
        { day: "Thu", date: "22 Oct", carbs: 213 },
        { day: "Fri", date: "23 Oct", carbs: 171 },
        { day: "Sat", date: "24 Oct", carbs: 229 },
        { day: "Sun", date: "25 Oct", carbs: 160 },
    ];

    const chartData = {
        labels: weeklyData.map((item) => [
            item.day,
            item.date,
        ]),

        datasets: [
            {
                label: "Carbohydrates",
                data: weeklyData.map((item) => item.carbs),

                backgroundColor: weeklyData.map((item) =>
                    item.carbs > 200 ? "#B42318" : "#2161B5"
                ),

                borderRadius: 4,
                barThickness: 38,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,

        layout: {
            padding: {
                top: 25,
            },
        },

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<"bar">) =>
                        `Carbohydrates: ${tooltipItem.raw} g`,
                },
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#475569",
                    font: {
                        size: 11,
                    },
                },
            },

            y: {
                min: 0,
                max: 300,

                ticks: {
                    stepSize: 75,
                    color: "#64748B",
                    font: {
                        size: 11,
                    },
                },

                grid: {
                    color: "#E2E8F0",
                },

                border: {
                    display: false,
                },
            },
        },
    };

    return (
        <Box
            w="100%"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            p={{ base: 3, md: 5 }}
        >
            {/* Header */}
            <Flex
                justify="space-between"
                align="center"
                flexWrap="wrap"
                gap={2}
                mb={1}
            >
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Weekly meal graph
                </Text>

                <Text
                    fontSize="xs"
                    bg="gray.100"
                    color="gray.600"
                    px={3}
                    py={1}
                    borderRadius="full"
                >
                    ⓘ Illustrative data
                </Text>
            </Flex>

            <Text fontSize="sm" color="gray.500" mb={4}>
                19–25 Oct 2026 · Carbohydrates per day (g)
            </Text>

            {/* Chart */}
            <Box w="100%" h={{ base: "260px", md: "320px" }}>
                <Bar
                    data={chartData}
                    options={options}
                    plugins={[customLabels]}
                />
            </Box>

            {/* Legend */}
            <HStack
                mt={5}
                gap={4}
                flexWrap="wrap"
                rowGap={2}
            >
                <HStack gap={2}>
                    <Box
                        boxSize="11px"
                        bg="#2161B5"
                        borderRadius="sm"
                    />
                    <Text fontSize="xs" color="gray.600">
                        Within threshold
                    </Text>
                </HStack>

                <HStack gap={2}>
                    <Box
                        boxSize="11px"
                        bg="#B42318"
                        borderRadius="sm"
                    />
                    <Text fontSize="xs" color="gray.600">
                        ▲ Above threshold
                    </Text>
                </HStack>

                <HStack gap={2}>
                    <Box
                        w="20px"
                        borderTop="2px dashed"
                        borderColor="#DC2626"
                    />
                    <Text fontSize="xs" color="gray.600">
                        Threshold (200 g)
                    </Text>
                </HStack>
            </HStack>
        </Box>
    );
};

export default WeeklyMealChart;
