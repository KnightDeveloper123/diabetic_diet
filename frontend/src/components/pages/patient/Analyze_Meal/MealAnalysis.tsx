import { useEffect, useState } from "react";
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { FiAlertCircle, FiArrowLeft, FiInfo, FiRefreshCw } from "react-icons/fi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Routes and API configuration                                        */
/* Confirm these three values against your AppRoutes.tsx and backend.  */
/* ------------------------------------------------------------------ */
const UPLOAD_PATH = "/patient/analyze-meal";
const MEAL_DETAILS_PATH = "/patient/meal-details";
const RESULTS_PATH = "/patient/review-results";

const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? "";
const ANALYZE_ENDPOINT = `${API_BASE_URL}/api/meals/analyze`;

const REQUEST_TIMEOUT_MS = 60000;
const DEMO_FAILURE_DELAY_MS = 2000;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface MealDetailsState {
    mealImage?: File | string;
    mealType: string;
    date: string;
    time: string;
    description: string;
    portionInfo: string;
    demoFailure: boolean;
}

type MealAnalysisResult = Record<string, unknown>;

type AnalysisStatus = "analyzing" | "error";

const steps = ["Upload", "Meal details", "Analyze", "Review results"];

const CURRENT_STEP_INDEX = 2;

/* ------------------------------------------------------------------ */
/* Backend integration point                                           */
/* Replace the body of this function if your API differs. It sends the */
/* photo and meal details and returns whatever the backend responds    */
/* with. Nothing is faked here: if the endpoint is missing or fails,   */
/* the page shows the error state.                                     */
/* ------------------------------------------------------------------ */
const imageToBlob = async (
    image: File | string,
    signal: AbortSignal
): Promise<Blob> => {
    if (image instanceof File) {
        return image;
    }

    const response = await fetch(image, { signal });

    if (!response.ok) {
        throw new Error("The selected photo could not be read. Please upload it again.");
    }

    return response.blob();
};

const requestMealAnalysis = async (
    details: MealDetailsState,
    image: File | string,
    signal: AbortSignal
): Promise<MealAnalysisResult> => {
    const imageBlob = await imageToBlob(image, signal);

    const formData = new FormData();
    formData.append("image", imageBlob);
    formData.append("mealType", details.mealType);
    formData.append("date", details.date);
    formData.append("time", details.time);
    formData.append("description", details.description);
    formData.append("portionInfo", details.portionInfo);

    // If your API needs a token, add an Authorization header here
    // using the value exposed by your AuthContext.
    const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        body: formData,
        credentials: "include",
        signal,
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const serverMessage =
            body && typeof body === "object" && "message" in body
                ? String((body as { message: unknown }).message)
                : "";

        throw new Error(
            serverMessage || "The analysis service could not analyze this meal."
        );
    }

    return (body ?? {}) as MealAnalysisResult;
};

const Meal_Analysis = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const details = location.state as MealDetailsState | null;

    const [status, setStatus] = useState<AnalysisStatus>("analyzing");
    const [errorMessage, setErrorMessage] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    /* Run the analysis. Re-runs only when the user presses Retry. */
    useEffect(() => {
        if (!details?.mealImage) {
            return;
        }

        const mealImage = details.mealImage;
        const controller = new AbortController();
        let timedOut = false;
        let demoTimerId: number | undefined;

        const timeoutId = window.setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, REQUEST_TIMEOUT_MS);

        setStatus("analyzing");
        setErrorMessage("");
        setElapsedSeconds(0);

        const runAnalysis = async () => {
            try {
                // Demo failure applies to the first attempt only,
                // so Retry then runs the real analysis.
                if (details.demoFailure && attempt === 0) {
                    await new Promise<void>((resolve) => {
                        demoTimerId = window.setTimeout(resolve, DEMO_FAILURE_DELAY_MS);
                    });

                    if (controller.signal.aborted) {
                        return;
                    }

                    throw new Error(
                        "Simulated failure: this is the demo error state. Press Retry to run the real analysis."
                    );
                }

                const result = await requestMealAnalysis(
                    details,
                    mealImage,
                    controller.signal
                );

                if (controller.signal.aborted) {
                    return;
                }

                navigate(RESULTS_PATH, {
                    replace: true,
                    state: {
                        ...details,
                        analysisResult: result,
                    },
                });
            } catch (error) {
                if (controller.signal.aborted && !timedOut) {
                    return;
                }

                if (timedOut) {
                    setErrorMessage(
                        "The analysis is taking longer than expected. Please check your connection and try again."
                    );
                } else if (error instanceof Error && error.message) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Something went wrong while analyzing your meal.");
                }

                setStatus("error");
            } finally {
                window.clearTimeout(timeoutId);
            }
        };

        runAnalysis();

        return () => {
            window.clearTimeout(timeoutId);
            window.clearTimeout(demoTimerId);
            controller.abort();
        };
    }, [attempt, details, navigate]);

    /* Elapsed seconds counter while analyzing. */
    useEffect(() => {
        if (status !== "analyzing") {
            return;
        }

        const intervalId = window.setInterval(() => {
            setElapsedSeconds((seconds) => seconds + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [status, attempt]);

    if (!details?.mealImage) {
        return <Navigate to={UPLOAD_PATH} replace />;
    }

    const handleRetry = () => {
        setAttempt((current) => current + 1);
    };

    const handleBackToDetails = () => {
        navigate(MEAL_DETAILS_PATH, {
            state: {
                ...details,
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
            <style>
                {`
                    @keyframes meal-scan {
                        0% { top: 8%; }
                        50% { top: 88%; }
                        100% { top: 8%; }
                    }
                    @keyframes meal-progress {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(260%); }
                    }
                    .meal-scan-line {
                        animation: meal-scan 2.2s ease-in-out infinite;
                    }
                    .meal-progress-bar {
                        animation: meal-progress 1.4s ease-in-out infinite;
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .meal-scan-line,
                        .meal-progress-bar {
                            animation: none;
                        }
                    }
                `}
            </style>

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
                            Analyze a meal
                        </Text>

                        <Text fontSize="sm" color="#64748B" mt={1}>
                            Take or upload a photo. You can check and correct everything before it&apos;s saved.
                        </Text>
                    </Box>

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
                                        index < CURRENT_STEP_INDEX
                                            ? "#168A7A"
                                            : index === CURRENT_STEP_INDEX
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
                                            index <= CURRENT_STEP_INDEX
                                                ? "none"
                                                : "1px solid #B9C4D2"
                                        }
                                        bg={
                                            index < CURRENT_STEP_INDEX
                                                ? "#168A7A"
                                                : index === CURRENT_STEP_INDEX
                                                    ? "#244A78"
                                                    : "transparent"
                                        }
                                        color={
                                            index <= CURRENT_STEP_INDEX
                                                ? "white"
                                                : "#64748B"
                                        }
                                        justify="center"
                                        align="center"
                                        fontSize="12px"
                                        fontWeight="600"
                                    >
                                        {index < CURRENT_STEP_INDEX ? "✓" : index + 1}
                                    </Flex>

                                    <Text
                                        fontSize="sm"
                                        color={
                                            index === CURRENT_STEP_INDEX
                                                ? "#1E293B"
                                                : "#64748B"
                                        }
                                        fontWeight={
                                            index === CURRENT_STEP_INDEX ? "700" : "500"
                                        }
                                        whiteSpace="nowrap"
                                    >
                                        {step}
                                    </Text>
                                </HStack>
                            </Box>
                        ))}
                    </Flex>

                    {/* ANALYZE CARD */}
                    <Box
                        bg="white"
                        border="1px solid #E2E8F0"
                        borderRadius="14px"
                        boxShadow="0 2px 5px rgba(0,0,0,0.03)"
                        overflow="hidden"
                    >
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            textAlign="center"
                            minH={{ base: "300px", md: "320px" }}
                            px={{ base: 4, md: 6 }}
                            py={{ base: 8, md: 10 }}
                            aria-live="polite"
                        >
                            {status === "analyzing" ? (
                                <>
                                    {/* ILLUSTRATION */}
                                    <Box
                                        position="relative"
                                        w="104px"
                                        h="104px"
                                        bg="#E2E8F0"
                                        borderRadius="8px"
                                        overflow="hidden"
                                        mb={6}
                                        aria-hidden="true"
                                    >
                                        <Box
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            w="84px"
                                            h="84px"
                                            transform="translate(-50%, -50%)"
                                            borderRadius="full"
                                            bg="white"
                                            border="1px solid #CBD5E1"
                                        />
                                        <Box
                                            position="absolute"
                                            top="22px"
                                            left="18px"
                                            w="30px"
                                            h="30px"
                                            borderRadius="full"
                                            bg="#8A6A00"
                                        />
                                        <Box
                                            position="absolute"
                                            top="20px"
                                            right="18px"
                                            w="26px"
                                            h="26px"
                                            borderRadius="full"
                                            bg="#C47F0A"
                                        />
                                        <Box
                                            position="absolute"
                                            bottom="20px"
                                            right="24px"
                                            w="30px"
                                            h="30px"
                                            borderRadius="full"
                                            bg="#168A7A"
                                        />
                                        <Box
                                            position="absolute"
                                            bottom="22px"
                                            left="20px"
                                            w="24px"
                                            h="24px"
                                            borderRadius="full"
                                            bg="#E2E8F0"
                                        />
                                        <Box
                                            className="meal-scan-line"
                                            position="absolute"
                                            left="0"
                                            right="0"
                                            h="2px"
                                            bg="#168A7A"
                                        />
                                    </Box>

                                    <Text
                                        fontSize="lg"
                                        fontWeight="700"
                                        color="#263445"
                                        mb={2}
                                    >
                                        Analyzing your meal...
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="#64748B"
                                        maxW="520px"
                                        mb={4}
                                    >
                                        Photo sent. Waiting for the analysis service — this usually takes a few seconds.
                                    </Text>

                                    <Box
                                        w="100%"
                                        maxW="320px"
                                        h="6px"
                                        bg="#E8EDF3"
                                        borderRadius="full"
                                        overflow="hidden"
                                        mb={3}
                                        role="progressbar"
                                        aria-label="Analyzing meal"
                                    >
                                        <Box
                                            className="meal-progress-bar"
                                            w="40%"
                                            h="100%"
                                            bg="#244A78"
                                            borderRadius="full"
                                        />
                                    </Box>

                                    <Text fontSize="xs" color="#64748B" mb={4}>
                                        {`${elapsedSeconds} s elapsed · please don't close this page`}
                                    </Text>

                                    <Button
                                        size="md"
                                        variant="ghost"
                                        color="#1E293B"
                                        fontSize="sm"
                                        fontWeight="700"
                                        onClick={handleBackToDetails}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Flex
                                        w="64px"
                                        h="64px"
                                        borderRadius="full"
                                        bg="#FEF2F2"
                                        color="#DC2626"
                                        justify="center"
                                        align="center"
                                        mb={5}
                                    >
                                        <FiAlertCircle size={30} />
                                    </Flex>

                                    <Text
                                        fontSize="lg"
                                        fontWeight="700"
                                        color="#263445"
                                        mb={2}
                                    >
                                        We couldn&apos;t analyze your meal
                                    </Text>

                                    <Text
                                        role="alert"
                                        fontSize="sm"
                                        color="#B91C1C"
                                        maxW="520px"
                                        mb={2}
                                    >
                                        {errorMessage}
                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="#64748B"
                                        maxW="520px"
                                        mb={6}
                                    >
                                        Your photo and meal details are still here. You can try again or go back and change them.
                                    </Text>

                                    <Flex
                                        gap={3}
                                        justify="center"
                                        wrap="wrap"
                                        w="100%"
                                    >
                                        <Button
                                            size="md"
                                            variant="outline"
                                            color="#334155"
                                            borderColor="#CBD5E1"
                                            fontSize="sm"
                                            onClick={handleBackToDetails}
                                        >
                                            <FiArrowLeft size={18} />
                                            Back to details
                                        </Button>

                                        <Button
                                            size="md"
                                            bg="#244A78"
                                            color="white"
                                            fontSize="sm"
                                            px={6}
                                            _hover={{ bg: "#18395F" }}
                                            onClick={handleRetry}
                                        >
                                            <FiRefreshCw size={17} />
                                            Retry analysis
                                        </Button>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                    </Box>

                    {/* DISCLAIMER */}
                    <HStack
                        align="flex-start"
                        gap={2}
                        mt="auto"
                        pt={6}
                        color="#64748B"
                    >
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

export default Meal_Analysis;