import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Flex, Grid, Text, Button, HStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import {
    FiActivity,
    FiArrowLeft,
    FiBox,
    FiCalendar,
    FiCheck,
    FiClock,
    FiCoffee,
    FiDroplet,
    FiFeather,
    FiFileText,
    FiInfo,
    FiLayers,
    FiPackage,
    FiSave,
    FiZap,
} from "react-icons/fi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* FINISH_PATH is a guess: change it to the page that should open     */
/* after the patient finishes (for example your patient dashboard).    */
/* ------------------------------------------------------------------ */
const UPLOAD_PATH = "/patient/analyze-meal";
const MEAL_DETAILS_PATH = "/patient/meal-details";
const FINISH_PATH = "/patient/dashboard";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface ReviewResultsState {
    mealImage?: File | string;
    mealType?: string;
    date?: string;
    time?: string;
    description?: string;
    portionInfo?: string;
    demoFailure?: boolean;
    analysisResult?: unknown;
}

type UnknownRecord = Record<string, unknown>;

type NutrientKey = "calories" | "carbs" | "protein" | "fat" | "fiber" | "sugar";

type NutrientValues = Partial<Record<NutrientKey, number>>;

interface NutrientDefinition {
    key: NutrientKey;
    label: string;
    unit: string;
    aliases: string[];
    icon: IconType;
    color: string;
    background: string;
}

interface FoodItem {
    name: string;
    quantity?: string;
    category?: string;
    confidence?: string;
    nutrients: NutrientValues;
}

interface Insight {
    title?: string;
    message: string;
}

interface ParsedAnalysis {
    foods: FoodItem[];
    totals: NutrientValues;
    derivedTotals: NutrientKey[];
    insights: Insight[];
    isDemo: boolean;
}

type SaveStatus = "idle" | "saved";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const steps = ["Upload", "Meal details", "Analyze", "Review results"];

const CURRENT_STEP_INDEX = 3;

const NUTRIENTS: NutrientDefinition[] = [
    {
        key: "calories",
        label: "Calories",
        unit: "kcal",
        aliases: ["calories", "calorie", "kcal", "energy", "energyKcal"],
        icon: FiZap,
        color: "#244A78",
        background: "#E8F0FC",
    },
    {
        key: "carbs",
        label: "Carbohydrates",
        unit: "g",
        aliases: ["carbs", "carbohydrates", "carbohydrate", "carbsG"],
        icon: FiLayers,
        color: "#C47F0A",
        background: "#FDF3E1",
    },
    {
        key: "protein",
        label: "Protein",
        unit: "g",
        aliases: ["protein", "proteins", "proteinG"],
        icon: FiActivity,
        color: "#7C4DBA",
        background: "#F1EAFA",
    },
    {
        key: "fat",
        label: "Fat",
        unit: "g",
        aliases: ["fat", "fats", "totalFat", "fatG"],
        icon: FiDroplet,
        color: "#C2410C",
        background: "#FDECE4",
    },
    {
        key: "fiber",
        label: "Fiber",
        unit: "g",
        aliases: ["fiber", "fibre", "dietaryFiber", "fiberG"],
        icon: FiFeather,
        color: "#168A7A",
        background: "#E6F4F1",
    },
    {
        key: "sugar",
        label: "Sugar",
        unit: "g",
        aliases: ["sugar", "sugars", "totalSugar", "sugarG"],
        icon: FiBox,
        color: "#BE185D",
        background: "#FCE7F1",
    },
];

const FOOD_LIST_KEYS = ["foods", "items", "detectedFoods", "foodItems", "food_items"];
const FOOD_NAME_KEYS = ["name", "foodName", "food", "label", "food_name"];
const FOOD_QUANTITY_KEYS = [
    "grams",
    "quantityGrams",
    "estimatedGrams",
    "weight",
    "weightG",
    "portionGrams",
    "quantity",
    "portion",
];
const FOOD_UNIT_KEYS = ["unit", "quantityUnit"];
const FOOD_CATEGORY_KEYS = ["category", "group", "foodGroup"];
const FOOD_CONFIDENCE_KEYS = ["confidence", "confidenceScore"];
const FOOD_NUTRITION_KEYS = ["nutrition", "nutrients"];
const TOTALS_KEYS = [
    "totals",
    "total",
    "nutritionTotals",
    "nutritionSummary",
    "summary",
    "nutrition",
];
const INSIGHT_KEYS = [
    "insights",
    "diabetesInsights",
    "observations",
    "mealObservations",
    "notes",
];
const DEMO_KEYS = ["isDemo", "demo"];

/* ------------------------------------------------------------------ */
/* Parsing helpers                                                     */
/* The backend response shape is not fixed yet, so every field is read */
/* defensively. Anything missing is simply not displayed.              */
/* ------------------------------------------------------------------ */
const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const pick = (source: UnknownRecord | undefined, keys: string[]): unknown => {
    if (!source) {
        return undefined;
    }

    for (const key of keys) {
        const value = source[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return undefined;
};

const toText = (value: unknown): string | undefined => {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();

    return trimmed ? trimmed : undefined;
};

const toNumber = (value: unknown): number | undefined => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string") {
        const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);

        if (!match) {
            return undefined;
        }

        const parsed = Number(match[0]);

        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
};

const formatNumber = (value: number): string =>
    Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");

const formatNutrient = (key: NutrientKey, value: number): string =>
    key === "calories" ? String(Math.round(value)) : formatNumber(value);

const unwrapResult = (raw: unknown): UnknownRecord => {
    if (!isRecord(raw)) {
        return {};
    }

    for (const key of ["data", "analysis", "result"]) {
        const inner = raw[key];

        if (isRecord(inner)) {
            return { ...raw, ...inner };
        }
    }

    return raw;
};

const readNutrients = (...sources: Array<UnknownRecord | undefined>): NutrientValues => {
    const values: NutrientValues = {};

    NUTRIENTS.forEach((nutrient) => {
        for (const source of sources) {
            const value = toNumber(pick(source, nutrient.aliases));

            if (value !== undefined) {
                values[nutrient.key] = value;
                break;
            }
        }
    });

    return values;
};

const readConfidence = (value: unknown): string | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) {
        const percent = value <= 1 ? value * 100 : value;

        return `${Math.round(percent)}% confidence`;
    }

    const text = toText(value);

    return text ? `${text} confidence` : undefined;
};

const readQuantity = (item: UnknownRecord): string | undefined => {
    const raw = pick(item, FOOD_QUANTITY_KEYS);
    const unit = toText(pick(item, FOOD_UNIT_KEYS));

    if (typeof raw === "number" && Number.isFinite(raw)) {
        return `${formatNumber(raw)} ${unit ?? "g"}`;
    }

    const text = toText(raw);

    if (!text) {
        return undefined;
    }

    return /^\d+(\.\d+)?$/.test(text) ? `${text} ${unit ?? "g"}` : text;
};

const parseFoods = (root: UnknownRecord): FoodItem[] => {
    const rawList = pick(root, FOOD_LIST_KEYS);

    if (!Array.isArray(rawList)) {
        return [];
    }

    const foods: FoodItem[] = [];

    rawList.forEach((entry, index) => {
        if (!isRecord(entry)) {
            return;
        }

        const nested = pick(entry, FOOD_NUTRITION_KEYS);

        foods.push({
            name: toText(pick(entry, FOOD_NAME_KEYS)) ?? `Food item ${index + 1}`,
            quantity: readQuantity(entry),
            category: toText(pick(entry, FOOD_CATEGORY_KEYS)),
            confidence: readConfidence(pick(entry, FOOD_CONFIDENCE_KEYS)),
            nutrients: readNutrients(isRecord(nested) ? nested : undefined, entry),
        });
    });

    return foods;
};

const parseInsights = (raw: unknown): Insight[] => {
    if (raw === undefined) {
        return [];
    }

    const list = Array.isArray(raw) ? raw : [raw];
    const insights: Insight[] = [];

    list.forEach((entry) => {
        const text = toText(entry);

        if (text) {
            insights.push({ message: text });
            return;
        }

        if (isRecord(entry)) {
            const message = toText(
                pick(entry, ["message", "description", "text", "detail", "insight"])
            );

            if (message) {
                insights.push({
                    title: toText(pick(entry, ["title", "label", "name"])),
                    message,
                });
            }
        }
    });

    return insights;
};

const parseAnalysis = (raw: unknown): ParsedAnalysis => {
    const root = unwrapResult(raw);
    const foods = parseFoods(root);

    const totalsSource = pick(root, TOTALS_KEYS);
    const totals = readNutrients(isRecord(totalsSource) ? totalsSource : undefined, root);
    const derivedTotals: NutrientKey[] = [];

    // When the backend gives no total for a nutrient, sum the values it
    // gave for the detected foods. Nothing is estimated or invented.
    NUTRIENTS.forEach(({ key }) => {
        if (totals[key] !== undefined) {
            return;
        }

        const values = foods
            .map((food) => food.nutrients[key])
            .filter((value): value is number => value !== undefined);

        if (values.length > 0) {
            totals[key] = values.reduce((sum, value) => sum + value, 0);
            derivedTotals.push(key);
        }
    });

    return {
        foods,
        totals,
        derivedTotals,
        insights: parseInsights(pick(root, INSIGHT_KEYS)),
        isDemo: DEMO_KEYS.some((key) => root[key] === true),
    };
};

const formatDateAndTime = (date?: string, time?: string) => {
    let dateText = date?.trim() ?? "";
    let timeText = time?.trim() ?? "";

    if (dateText) {
        const parsedDate = new Date(`${dateText}T00:00:00`);

        if (!Number.isNaN(parsedDate.getTime())) {
            dateText = parsedDate.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }
    }

    if (timeText) {
        const parsedTime = new Date(`1970-01-01T${timeText}:00`);

        if (!Number.isNaN(parsedTime.getTime())) {
            timeText = parsedTime.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
            });
        }
    }

    return { dateText, timeText };
};

/* ------------------------------------------------------------------ */
/* Small presentational components                                     */
/* ------------------------------------------------------------------ */
const ProgressSteps = () => (
    <Flex gap={3} mb={6} overflowX="auto" pb={2}>
        {steps.map((step, index) => (
            <Box key={step} flex="1" minW="115px">
                <Box
                    h="3px"
                    bg={index < CURRENT_STEP_INDEX ? "#168A7A" : "#244A78"}
                    mb={3}
                />

                <HStack gap={2}>
                    <Flex
                        w="22px"
                        h="22px"
                        flexShrink={0}
                        borderRadius="full"
                        bg={index < CURRENT_STEP_INDEX ? "#168A7A" : "#244A78"}
                        color="white"
                        justify="center"
                        align="center"
                        fontSize="12px"
                        fontWeight="600"
                    >
                        {index < CURRENT_STEP_INDEX ? "✓" : index + 1}
                    </Flex>

                    <Text
                        fontSize="sm"
                        color={index === CURRENT_STEP_INDEX ? "#1E293B" : "#64748B"}
                        fontWeight={index === CURRENT_STEP_INDEX ? "700" : "500"}
                        whiteSpace="nowrap"
                    >
                        {step}
                    </Text>
                </HStack>
            </Box>
        ))}
    </Flex>
);

interface SectionCardProps {
    title: string;
    children: ReactNode;
    action?: ReactNode;
}

const SectionCard = ({ title, children, action }: SectionCardProps) => (
    <Box
        bg="white"
        border="1px solid #E2E8F0"
        borderRadius="14px"
        boxShadow="0 2px 5px rgba(0,0,0,0.03)"
        p={{ base: 4, md: 6 }}
        mb={5}
    >
        <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={4}>
            <Text fontSize="lg" fontWeight="700" color="#263445">
                {title}
            </Text>

            {action}
        </Flex>

        {children}
    </Box>
);

interface DetailRowProps {
    icon: IconType;
    label: string;
    value?: string;
}

const DetailRow = ({ icon: Icon, label, value }: DetailRowProps) => (
    <Flex gap={3} align="flex-start">
        <Flex
            w="34px"
            h="34px"
            flexShrink={0}
            borderRadius="9px"
            bg="#E8F0FC"
            color="#244A78"
            justify="center"
            align="center"
        >
            <Icon size={17} />
        </Flex>

        <Box minW={0}>
            <Text fontSize="xs" fontWeight="600" color="#64748B">
                {label}
            </Text>

            {value ? (
                <Text fontSize="sm" color="#1E293B" fontWeight="600" wordBreak="break-word">
                    {value}
                </Text>
            ) : (
                <Text fontSize="sm" color="#94A3B8">
                    Not provided
                </Text>
            )}
        </Box>
    </Flex>
);

interface NutrientCardProps {
    nutrient: NutrientDefinition;
    value: number;
    derived: boolean;
}

const NutrientCard = ({ nutrient, value, derived }: NutrientCardProps) => {
    const Icon = nutrient.icon;

    return (
        <Flex
            direction="column"
            gap={3}
            border="1px solid #E2E8F0"
            borderRadius="12px"
            p={4}
            bg="white"
        >
            <Flex
                w="36px"
                h="36px"
                borderRadius="10px"
                bg={nutrient.background}
                color={nutrient.color}
                justify="center"
                align="center"
            >
                <Icon size={18} />
            </Flex>

            <Box>
                <Text fontSize="xs" fontWeight="600" color="#64748B">
                    {nutrient.label}
                    {derived ? " *" : ""}
                </Text>

                <Text fontSize="xl" fontWeight="700" color="#1E293B" lineHeight="1.2">
                    {formatNutrient(nutrient.key, value)}{" "}
                    <Text as="span" fontSize="sm" fontWeight="500" color="#64748B">
                        {nutrient.unit}
                    </Text>
                </Text>
            </Box>
        </Flex>
    );
};

const FoodCard = ({ food }: { food: FoodItem }) => {
    const available = NUTRIENTS.filter(({ key }) => food.nutrients[key] !== undefined);

    return (
        <Box border="1px solid #D5DEE9" borderRadius="12px" p={{ base: 3, md: 4 }}>
            <Flex justify="space-between" align="flex-start" gap={3} wrap="wrap">
                <Box minW={0}>
                    <Text fontSize="md" fontWeight="700" color="#263445" wordBreak="break-word">
                        {food.name}
                    </Text>

                    {food.category && (
                        <Text fontSize="xs" color="#64748B" mt={1}>
                            {food.category}
                        </Text>
                    )}
                </Box>

                <Flex gap={2} wrap="wrap" align="center">
                    {food.quantity && (
                        <Flex
                            align="center"
                            gap={1}
                            bg="#E8F0FC"
                            color="#244A78"
                            borderRadius="full"
                            px={3}
                            py="3px"
                            fontSize="xs"
                            fontWeight="700"
                        >
                            <FiPackage size={13} />
                            {food.quantity}
                        </Flex>
                    )}

                    {food.confidence && (
                        <Text fontSize="xs" fontWeight="600" color="#64748B">
                            {food.confidence}
                        </Text>
                    )}
                </Flex>
            </Flex>

            {available.length > 0 && (
                <Grid
                    templateColumns={{
                        base: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        lg: "repeat(6, 1fr)",
                    }}
                    gap={3}
                    mt={4}
                    pt={4}
                    borderTop="1px solid #EEF2F6"
                >
                    {available.map((nutrient) => (
                        <Box key={nutrient.key}>
                            <Text fontSize="xs" color="#64748B">
                                {nutrient.label}
                            </Text>

                            <Text fontSize="sm" fontWeight="700" color="#1E293B">
                                {formatNutrient(nutrient.key, food.nutrients[nutrient.key] ?? 0)}{" "}
                                {nutrient.unit}
                            </Text>
                        </Box>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Review_Results = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const details = location.state as ReviewResultsState | null;

    const mealImage = details?.mealImage;
    const analysisResult = details?.analysisResult;

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

    const analysis = useMemo(() => parseAnalysis(analysisResult), [analysisResult]);

    useEffect(() => {
        if (!mealImage) {
            setImageUrl(null);
            return;
        }

        if (typeof mealImage === "string") {
            setImageUrl(mealImage);
            return;
        }

        const objectUrl = URL.createObjectURL(mealImage);
        setImageUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [mealImage]);

    if (!details || analysisResult === undefined) {
        return <Navigate to={UPLOAD_PATH} replace />;
    }

    const { dateText, timeText } = formatDateAndTime(details.date, details.time);

    const summaryNutrients = NUTRIENTS.filter(
        ({ key }) => analysis.totals[key] !== undefined
    );

    const hasDerivedTotals = analysis.derivedTotals.length > 0;

    const handleBack = () => {
        navigate(MEAL_DETAILS_PATH, {
            state: {
                mealImage: details.mealImage,
                mealType: details.mealType,
                date: details.date,
                time: details.time,
                description: details.description,
                portionInfo: details.portionInfo,
                demoFailure: details.demoFailure,
            },
        });
    };

    // Integration point: call your save API here once it exists.
    // For now this only updates the page, nothing is stored.
    const handleSave = () => {
        setSaveStatus("saved");
    };

    const handleFinish = () => {
        navigate(FINISH_PATH);
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
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    p={{ base: 4, md: 6 }}
                    maxW="1200px"
                    w="100%"
                    mx="auto"
                >
                    {/* PAGE HEADING */}
                    <Box mb={5}>
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="700"
                            color="#1E293B"
                        >
                            Review Meal Analysis
                        </Text>

                        <Text fontSize="sm" color="#64748B" mt={1}>
                            Review the detected foods and nutritional information for this meal. Check each item and correct anything that looks wrong before you finish.
                        </Text>
                    </Box>

                    <ProgressSteps />

                    {/* DEMO NOTICE (only when the backend marks the result as demo) */}
                    {analysis.isDemo && (
                        <Flex
                            gap={3}
                            align="flex-start"
                            bg="#E8F0FC"
                            border="1px solid #BCD0EE"
                            borderRadius="10px"
                            p={4}
                            mb={5}
                        >
                            <Box flexShrink={0} mt="2px" color="#244A78">
                                <FiInfo size={16} />
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="700" color="#1E293B">
                                    Demo result — not produced by a real AI model
                                </Text>

                                <Text fontSize="sm" color="#334155">
                                    Foods and portions are estimated. Check each item before saving.
                                </Text>
                            </Box>
                        </Flex>
                    )}

                    {/* MEAL IMAGE AND DETAILS */}
                    <SectionCard title="Meal details">
                        <Grid
                            templateColumns={{ base: "1fr", md: "260px 1fr" }}
                            gap={{ base: 5, md: 6 }}
                            alignItems="start"
                        >
                            <Flex
                                bg="#E2E8F0"
                                borderRadius="12px"
                                overflow="hidden"
                                justify="center"
                                align="center"
                                w="100%"
                                maxW={{ base: "320px", md: "260px" }}
                                mx={{ base: "auto", md: "0" }}
                                aspectRatio="1 / 1"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Uploaded meal"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <Text fontSize="sm" color="#64748B" px={4} textAlign="center">
                                        Meal photo not available
                                    </Text>
                                )}
                            </Flex>

                            <Grid
                                templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                                gap={5}
                            >
                                <DetailRow
                                    icon={FiCoffee}
                                    label="Meal type"
                                    value={toText(details.mealType)}
                                />

                                <DetailRow
                                    icon={FiCalendar}
                                    label="Date"
                                    value={dateText || undefined}
                                />

                                <DetailRow
                                    icon={FiClock}
                                    label="Time"
                                    value={timeText || undefined}
                                />

                                <DetailRow
                                    icon={FiPackage}
                                    label="Portion information"
                                    value={toText(details.portionInfo)}
                                />

                                <Box gridColumn={{ base: "auto", sm: "1 / -1" }}>
                                    <DetailRow
                                        icon={FiFileText}
                                        label="Description"
                                        value={toText(details.description)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </SectionCard>

                    {/* NUTRITION SUMMARY */}
                    <SectionCard title="Nutrition summary">
                        {summaryNutrients.length > 0 ? (
                            <>
                                <Grid
                                    templateColumns={{
                                        base: "repeat(2, 1fr)",
                                        md: "repeat(3, 1fr)",
                                        xl: "repeat(6, 1fr)",
                                    }}
                                    gap={3}
                                >
                                    {summaryNutrients.map((nutrient) => (
                                        <NutrientCard
                                            key={nutrient.key}
                                            nutrient={nutrient}
                                            value={analysis.totals[nutrient.key] ?? 0}
                                            derived={analysis.derivedTotals.includes(nutrient.key)}
                                        />
                                    ))}
                                </Grid>

                                {hasDerivedTotals && (
                                    <Text fontSize="xs" color="#64748B" mt={3}>
                                        * Summed from the detected food items.
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text fontSize="sm" color="#64748B">
                                The analysis did not return nutrition totals for this meal.
                            </Text>
                        )}
                    </SectionCard>

                    {/* DETECTED FOODS */}
                    <SectionCard title={`Detected foods (${analysis.foods.length})`}>
                        {analysis.foods.length > 0 ? (
                            <Flex direction="column" gap={4}>
                                {analysis.foods.map((food, index) => (
                                    <FoodCard key={`${food.name}-${index}`} food={food} />
                                ))}
                            </Flex>
                        ) : (
                            <Text fontSize="sm" color="#64748B">
                                No food items were returned for this meal.
                            </Text>
                        )}
                    </SectionCard>

                    {/* INSIGHTS (only when provided by the backend) */}
                    {analysis.insights.length > 0 && (
                        <SectionCard title="Diabetes-friendly insights">
                            <Flex direction="column" gap={3}>
                                {analysis.insights.map((insight, index) => (
                                    <Flex
                                        key={`${insight.message}-${index}`}
                                        gap={3}
                                        align="flex-start"
                                        bg="#F8FAFC"
                                        border="1px solid #E2E8F0"
                                        borderRadius="10px"
                                        p={3}
                                    >
                                        <Box flexShrink={0} mt="2px" color="#168A7A">
                                            <FiInfo size={16} />
                                        </Box>

                                        <Box minW={0}>
                                            {insight.title && (
                                                <Text fontSize="sm" fontWeight="700" color="#263445">
                                                    {insight.title}
                                                </Text>
                                            )}

                                            <Text fontSize="sm" color="#334155" wordBreak="break-word">
                                                {insight.message}
                                            </Text>
                                        </Box>
                                    </Flex>
                                ))}
                            </Flex>
                        </SectionCard>
                    )}

                    {/* SAVE NOTICE */}
                    {saveStatus === "saved" && (
                        <Flex
                            role="status"
                            gap={3}
                            align="flex-start"
                            bg="#E6F4F1"
                            border="1px solid #B7DFD8"
                            borderRadius="10px"
                            p={4}
                            mb={5}
                        >
                            <Box flexShrink={0} mt="2px" color="#0F5F54">
                                <FiCheck size={16} />
                            </Box>

                            <Text fontSize="sm" color="#0F5F54">
                                Results marked as saved on this page. Saving to your account will work once the save API is connected.
                            </Text>
                        </Flex>
                    )}

                    {/* ACTION BUTTONS */}
                    <Flex
                        bg="white"
                        border="1px solid #E2E8F0"
                        borderRadius="14px"
                        boxShadow="0 2px 5px rgba(0,0,0,0.03)"
                        px={{ base: 4, md: 6 }}
                        py={4}
                        gap={3}
                        direction={{ base: "column", sm: "row" }}
                        align={{ base: "stretch", sm: "center" }}
                        justify="space-between"
                    >
                        <Button
                            size="md"
                            variant="ghost"
                            color="#334155"
                            fontSize="sm"
                            onClick={handleBack}
                        >
                            <FiArrowLeft size={18} />
                            Back to Meal Details
                        </Button>

                        <Flex
                            gap={3}
                            direction={{ base: "column", sm: "row" }}
                            align={{ base: "stretch", sm: "center" }}
                        >
                            <Button
                                size="md"
                                variant="outline"
                                color="#244A78"
                                borderColor="#244A78"
                                fontSize="sm"
                                px={6}
                                _hover={{ bg: "#E8F0FC" }}
                                disabled={saveStatus === "saved"}
                                onClick={handleSave}
                            >
                                {saveStatus === "saved" ? (
                                    <FiCheck size={17} />
                                ) : (
                                    <FiSave size={17} />
                                )}
                                {saveStatus === "saved" ? "Saved" : "Save Results"}
                            </Button>

                            <Button
                                size="md"
                                bg="#244A78"
                                color="white"
                                fontSize="sm"
                                px={6}
                                _hover={{ bg: "#18395F" }}
                                onClick={handleFinish}
                            >
                                <FiCheck size={17} />
                                Finish
                            </Button>
                        </Flex>
                    </Flex>

                    {/* DISCLAIMER */}
                    <HStack align="flex-start" gap={2} mt="auto" pt={6} color="#64748B">
                        <Box flexShrink={0} mt="2px">
                            <FiInfo size={14} />
                        </Box>

                        <Text fontSize="xs">
                            Food recognition, portion sizes, nutrition values and glucose curves are estimates and may be inaccurate. This app does not diagnose or treat any condition — consult a qualified healthcare professional for personal medical decisions.
                        </Text>
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Review_Results;