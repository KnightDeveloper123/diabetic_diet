
import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";

import MealSteps, {
    type MealFormData,
    type MealAnalysisResult,
} from "./MealSteps";
import useFetch from "../../../hooks/uesFetch";
import { useAuth } from "../../../context/AuthContext";

// const API_BASE_URL: string = (
//     import.meta.env.VITE_API_URL ?? ""
// ).replace(/\/+$/, "");

// const ANALYZE_ENDPOINT = `${API_BASE_URL}/api/meals/analyze`;

const getInitialMealData = (): MealFormData => ({
    mealImage: null,
    mealType: "Breakfast",
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    portionInfo: "",
});

const MealAnalysis = () => {

    const {loading, request }= useFetch();
    const { user } =useAuth()
    // console.log(user)
    const [activeStep, setActiveStep] = useState(0);


    const [mealData, setMealData] =
        useState<MealFormData>(getInitialMealData);

    const [analysisResult, setAnalysisResult] =
        useState<MealAnalysisResult | null>(null);

    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateMealData = (data: Partial<MealFormData>) => {
        setMealData((previous) => ({
            ...previous,
            ...data,
        }));

        setError("");
    };

    const handleAnalyze = async () => {
        if (loading) return;

        if (!mealData.mealImage) {
            setError("Please upload a meal photo first.");
            setActiveStep(0);
            return;
        }

        if (!mealData.mealType || !mealData.date || !mealData.time) {
            setError("Please fill in all required meal details.");
            setActiveStep(1);
            return;
        }

        // setLoading(true);
        setError("");
        setAnalysisResult(null);
        setActiveStep(2);

        try {
            const formData = new FormData();
            console.log(mealData)

            formData.append("image", mealData.mealImage);
            formData.append("meal_type", mealData.mealType);
            formData.append("user_id", String(user?.id));
            formData.append("date", mealData.date);
            formData.append("time", mealData.time);
            formData.append("description", mealData.description);
            formData.append("portionInfo", mealData.portionInfo);

            // const response = await fetch(ANALYZE_ENDPOINT, {
            //     method: "POST",
            //     body: formData,
            //     credentials: "include",
            // });

            const response = await request({
                url: '/api/calculation/analyze-image',
                method: 'POST',
                body: formData,
                withLoader: true
            })

             if (response.status === 1) {

                // setAnalysisResult(result as MealAnalysisResult);
            setActiveStep(3);
             }


            // const result: unknown = await response
            //     .json()
            //     .catch(() => null);

            // if (!response.ok) {
            //     const message =
            //         result !== null &&
            //         typeof result === "object" &&
            //         "message" in result
            //             ? String(result.message)
            //             : `Meal analysis failed (${response.status}).`;

            //     throw new Error(message);
            // }

            // if (result === null || typeof result !== "object") {
            //     throw new Error(
            //         "The analysis API returned an invalid response."
            //     );
            // }

            
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while analyzing your meal."
            );

            setActiveStep(2);
        } finally {
            // setLoading(false);
        }
    };

    const handleNext = () => {
        setError("");

        if (activeStep === 0) {
            if (!mealData.mealImage) {
                setError("Please upload a meal photo first.");
                return;
            }

            setActiveStep(1);
            return;
        }

        if (activeStep === 1) {
            void handleAnalyze();
        }
    };

    const handleBack = () => {
        if (loading) return;

        setError("");

        if (activeStep === 2) {
            setActiveStep(1);
            return;
        }

        setActiveStep((previous) => Math.max(previous - 1, 0));
    };

    const handleRetry = () => {
        void handleAnalyze();
    };

    const handleStartAgain = () => {
        if (loading) return;

        setMealData(getInitialMealData());
        setAnalysisResult(null);
        setError("");
        setActiveStep(0);
    };

    return (
        <Box
            minH="100%"
            bg="#F5F7FB"
            p={{ base: 3, md: 6 }}
            borderRadius="xl"
        >
            <Box maxW="1100px" mx="auto">
                <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    color="#1E293B"
                >
                    Analyze a meal
                </Text>

                <Text
                    color="gray.600"
                    fontSize="sm"
                    mt={1}
                    mb={6}
                >
                    Upload your meal photo and review its estimated
                    nutritional information.
                </Text>

                <MealSteps
                    activeStep={activeStep}
                    mealData={mealData}
                    analysisResult={analysisResult}
                    loading={loading}
                    error={error}
                    onUpdate={updateMealData}
                    onNext={handleNext}
                    onBack={handleBack}
                    onRetry={handleRetry}
                    onStartAgain={handleStartAgain}
                />
            </Box>
        </Box>
    );
};

export default MealAnalysis;
