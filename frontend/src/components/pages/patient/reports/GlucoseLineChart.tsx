import { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, } from "recharts";

export interface PythonPlotTrace {
    type?: string;
    name?: string;
    mode?: string;
    x?: Array<string | number> | { dtype?: string; bdata?: string };
    y?: Array<number | null> | { dtype?: string; bdata?: string };
    theta?: string[];
    r?: number[];
    line?: { color?: string; dash?: string; width?: number };
    marker?: { color?: string; size?: number };
    fill?: string;
}

export interface PythonPlotChart {
    data?: PythonPlotTrace[];
    layout?: {
        title?: { text?: string };
        height?: number;
        shapes?: Array<{
            type?: string;
            y0?: number;
            y1?: number;
            line?: { color?: string; dash?: string };
            fillcolor?: string;
        }>;
        annotations?: Array<{ text?: string }>;
        xaxis?: { title?: { text?: string } };
        yaxis?: { title?: { text?: string }; range?: number[] };
    };
}

interface ChartProps {
    chart?: PythonPlotChart | null;
    title: string;
    height?: number;
}

/** Decode Plotly's base64 typed-array representation if the API sends one. */
const toNumberArray = (
    value?: Array<number | null> | { dtype?: string; bdata?: string }
): Array<number | null> => {
    if (Array.isArray(value)) return value.map((v) => (v == null ? null : Number(v)));
    if (!value?.bdata || typeof window === "undefined") return [];

    try {
        const binary = window.atob(value.bdata);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const dtype = value.dtype || "f8";
        const view = new DataView(bytes.buffer);
        const bytesPerValue = dtype.endsWith("4") ? 4 : 8;
        const result: number[] = [];

        for (let offset = 0; offset + bytesPerValue <= bytes.byteLength; offset += bytesPerValue) {
            result.push(
                bytesPerValue === 4
                    ? view.getFloat32(offset, true)
                    : view.getFloat64(offset, true)
            );
        }
        return result;
    } catch {
        return [];
    }
};

const COLORS = ["#3182CE", "#E53E3E", "#38A169", "#805AD5", "#DD6B20"];

const makeSeriesRows = (chart?: PythonPlotChart | null) => {
    const traces = chart?.data || [];
    if (!traces.length) return { rows: [], series: [] as Array<{ key: string; name: string; color: string }> };

    const normalized = traces
        .filter((trace) => trace.type !== "scatterpolar" && trace.x)
        .map((trace, index) => {
            const xValues = Array.isArray(trace.x) ? trace.x : [];
            const yValues = toNumberArray(trace.y);
            return {
                name: trace.name || `Series ${index + 1}`,
                color: trace.line?.color || COLORS[index % COLORS.length],
                points: xValues.map((x, pointIndex) => ({
                    x: String(x),
                    y: yValues[pointIndex] == null ? null : Number(yValues[pointIndex]),
                })),
            };
        });

    const xLabels = Array.from(new Set(normalized.flatMap((item) => item.points.map((p) => p.x))));
    const series = normalized.map((item, index) => ({
        key: `series${index}`,
        name: item.name,
        color: item.color,
    }));

    const rows = xLabels.map((x) => {
        const row: Record<string, string | number | null> = { x };
        normalized.forEach((item, index) => {
            row[`series${index}`] = item.points.find((point) => point.x === x)?.y ?? null;
        });
        return row;
    });

    return { rows, series };
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={{ base: 2, md: 3 }} minW={0}>
        <Text fontSize="sm" fontWeight="700" color="gray.800" px={2} pt={1} mb={2}>
            {title}
        </Text>
        {children}
    </Box>
);

const EmptyChart = ({ chart, height }: { chart?: PythonPlotChart | null; height: number }) => {
    const message = chart?.layout?.annotations?.[0]?.text || "No chart data available for this period.";
    return (
        <Box h={`${height}px`} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="md">
            <Text color="gray.500" fontSize="sm" textAlign="center" px={4}>{message}</Text>
        </Box>
    );
};

const GlucoseLineChart = ({ chart, title, height = 360 }: ChartProps) => {
    const { rows, series } = useMemo(() => makeSeriesRows(chart), [chart]);
    const hasData = rows.length > 0 && series.length > 0;

    const yTitle = chart?.layout?.yaxis?.title?.text || "Estimated glucose (mg/dL)";
    const xTitle = chart?.layout?.xaxis?.title?.text || "Time";

    return (
        <ChartCard title={chart?.layout?.title?.text || title}>
            {!hasData ? <EmptyChart chart={chart} height={height} /> : (
                <Box h={`${height}px`} w="100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rows} margin={{ top: 18, right: 20, left: 8, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="x" tick={{ fontSize: 10 }} minTickGap={24} angle={-20} textAnchor="end" label={{ value: xTitle, position: "insideBottom", offset: -25, fontSize: 11 }} />
                            <YAxis domain={chart?.layout?.yaxis?.range || ["auto", "auto"]} tick={{ fontSize: 11 }} label={{ value: yTitle, angle: -90, position: "insideLeft", fontSize: 11 }} />
                            <Tooltip />
                            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                            <ReferenceArea y1={70} y2={180} fill="#48BB78" fillOpacity={0.10} />
                            <ReferenceLine y={180} stroke="#E53E3E" strokeDasharray="6 5" />
                            {series.map((item) => (
                                <Line key={item.key} type="monotone" dataKey={item.key} name={item.name} stroke={item.color} strokeWidth={2} dot={false} connectNulls />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </ChartCard>
    );
};

export const TodayGlucoseChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <GlucoseLineChart chart={chart} title="Estimated glucose throughout the day" />
);

export const WhatIfGlucoseChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <GlucoseLineChart chart={chart} title="What-if glucose comparison" />
);

export const CompareGlucoseChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <GlucoseLineChart chart={chart} title="Selected day vs usual day" />
);

export const GlucoseJourneyChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <GlucoseLineChart chart={chart} title="Glucose journey" height={430} />
);

export const GlucoseCarbsScatterChart = ({ chart, }: { chart?: PythonPlotChart | null }) => {
    const points = useMemo(() => {
        const trace = chart?.data?.[0];
        const x = toNumberArray(trace?.x as any);
        const y = toNumberArray(trace?.y as any);
        return x.map((value, index) => ({ carbs: value, glucose: y[index] })).filter((p) => p.glucose != null);
    }, [chart]);

    return (
        <ChartCard title={chart?.layout?.title?.text || "Glucose vs carbohydrates"}>
            {points.length === 0 ? <EmptyChart chart={chart} height={340} /> : (
                <Box h="340px" w="100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 35, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="carbs" name="Carbohydrates" tick={{ fontSize: 11 }} label={{ value: "Carbohydrates (g)", position: "insideBottom", offset: -22 }} />
                            <YAxis type="number" dataKey="glucose" name="Glucose" tick={{ fontSize: 11 }} label={{ value: "Glucose (mg/dL)", angle: -90, position: "insideLeft" }} />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Scatter name="Meals" data={points} fill="#3182CE" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </ChartCard>
    );
};

const NutritionRadarChart = ({ chart, title }: ChartProps) => {
    const radarData = useMemo(() => {
        const traces = chart?.data?.filter((trace) => trace.type === "scatterpolar") || [];
        const labels = traces[0]?.theta || [];
        return labels.slice(0, -1).map((label, index) => {
            const row: Record<string, string | number> = { nutrient: label };
            traces.forEach((trace, traceIndex) => {
                row[`series${traceIndex}`] = Number(trace.r?.[index] ?? 0);
            });
            return row;
        });
    }, [chart]);

    const traces = chart?.data?.filter((trace) => trace.type === "scatterpolar") || [];

    return (
        <ChartCard title={chart?.layout?.title?.text || title}>
            {radarData.length === 0 ? <EmptyChart chart={chart} height={380} /> : (
                <Box h="380px" w="100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} outerRadius="70%">
                            <PolarGrid />
                            <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 10 }} />
                            <PolarRadiusAxis tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            {traces.map((trace, index) => (
                                <Radar
                                    key={`${trace.name || "series"}-${index}`}
                                    name={trace.name || `Series ${index + 1}`}
                                    dataKey={`series${index}`}
                                    stroke={trace.line?.color || COLORS[index % COLORS.length]}
                                    fill={trace.line?.color || COLORS[index % COLORS.length]}
                                    fillOpacity={trace.fill === "toself" ? 0.20 : 0}
                                    strokeDasharray={trace.line?.dash === "dash" ? "5 4" : undefined}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </ChartCard>
    );
};

export const TodayNutritionRadarChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <NutritionRadarChart chart={chart} title="Daily nutrition profile" />
);

export const WeeklyNutritionRadarChart = ({ chart }: { chart?: PythonPlotChart | null }) => (
    <NutritionRadarChart chart={chart} title="Weekly nutrition profile" />
);
