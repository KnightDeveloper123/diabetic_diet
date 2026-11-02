
import { Box, Flex, Text } from "@chakra-ui/react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
    Tooltip,
    LabelList,
    Cell,
} from "recharts";

interface WeeklyMealData {
    day: string;
    date: string;
    value: number;
}

interface ThresholdBarGraphProps {
    data: WeeklyMealData[];
    threshold?: number;
    title?: string;
    subtitle?: string;
}

const ThresholdBarGraph = ({ data, threshold = 200, title, subtitle, }: ThresholdBarGraphProps) => {
    return (
        <Box
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="9px"
            p={{ base: 3, md: 4 }}
            mb={4}
            boxShadow="0 1px 2px rgba(0,0,0,0.03)"
        >
            {/* HEADER */}
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
                        {title || ""}
                    </Text>

                    <Text fontSize="10px" color="#64748B" mt={1}>
                        {subtitle || ""}
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

            {/* RECHARTS */}
            <Box w="100%" h="190px">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 22,
                            right: 5,
                            left: -15,
                            bottom: 0,
                        }}
                        barCategoryGap="35%"
                    >
                        <CartesianGrid
                            stroke="#E8EDF3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={{ stroke: "#CBD5E1" }}
                            tickLine={false}
                            interval={0}
                            tick={({ x, y, payload }: any) => {
                                const item = data.find(
                                    (d) => d.day === payload.value
                                );

                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={12}
                                            textAnchor="middle"
                                            fill="#475569"
                                            fontSize={"10px"}
                                            fontWeight={600}
                                        >
                                            {item?.day}
                                        </text>

                                        <text
                                            x={0}
                                            y={25}
                                            textAnchor="middle"
                                            fill="#64748B"
                                            fontSize={"9px"}
                                        >
                                            {item?.date}
                                        </text>
                                    </g>
                                );
                            }}
                        />

                        <YAxis
                            domain={[0, 300]}
                            ticks={[0, 75, 150, 225, 300]}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#475569",
                                fontSize: 9,
                            }}
                        />

                        <Tooltip
                            cursor={{ fill: "#F1F5F9" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #E2E8F0",
                                fontSize: "11px",
                            }}
                            formatter={(value) => [
                                `${value} g`,
                                "Carbohydrates",
                            ]}
                            labelFormatter={(label) => {
                                const item = data.find(
                                    (d) => d.day === label
                                );
                                return `${item?.day} ${item?.date}`;
                            }}
                        />

                        {/* THRESHOLD LINE */}
                        <ReferenceLine
                            y={threshold}
                            stroke="#DC2626"
                            strokeWidth={1.5}
                            strokeDasharray="5 4"
                        />

                        {/* BARS */}
                        <Bar
                            dataKey="value"
                            barSize={25}
                            radius={[3, 3, 0, 0]}
                        >
                            {data.map((item) => (
                                <Cell
                                    key={item.day}
                                    fill={
                                        item.value > threshold
                                            ? "#B42318"
                                            : "#2463B8"
                                    }
                                />
                            ))}

                            {/* VALUE LABELS */}
                            <LabelList
                                dataKey="value"
                                position="top"
                                content={(props: any) => {
                                    const {
                                        x,
                                        y,
                                        width,
                                        value,
                                        index,
                                    } = props;

                                    const isAbove =
                                        data[index]?.value > threshold;

                                    return (
                                        <text
                                            x={x + width / 2}
                                            y={y - 5}
                                            textAnchor="middle"
                                            fill={
                                                isAbove
                                                    ? "#B42318"
                                                    : "#334155"
                                            }
                                            fontSize={9}
                                            fontWeight={700}
                                        >
                                            {isAbove ? "▲ " : ""}
                                            {value}
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* LEGEND */}
            <Flex
                wrap="wrap"
                gap={{ base: 2, md: 4 }}
                mt={3}
                align="center"
            >
                <Flex align="center" gap={1}>
                    <Box
                        w="8px"
                        h="8px"
                        bg="#2463B8"
                        borderRadius="2px"
                    />
                    <Text fontSize="9px" color="#475569">
                        Within threshold
                    </Text>
                </Flex>

                <Flex align="center" gap={1}>
                    <Box
                        w="8px"
                        h="8px"
                        bg="#B42318"
                        borderRadius="2px"
                    />
                    <Text fontSize="9px" color="#475569">
                        Above threshold
                    </Text>
                </Flex>

                <Flex align="center" gap={1}>
                    <Box
                        w="12px"
                        borderTop="1.5px dashed #DC2626"
                    />
                    <Text fontSize="9px" color="#475569">
                        Threshold ({threshold} g)
                    </Text>
                </Flex>
            </Flex>
        </Box >
    );
};

export default ThresholdBarGraph;
