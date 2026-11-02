
import {
    Box,
    Button,
    DataList,
    Flex,
    HStack,
    Image,
    Input,
    Spinner,
    Steps,
    Table,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import {
    FiArrowLeft,
    FiArrowRight,
    FiCheck,
    FiRefreshCw,
    FiUploadCloud,
} from "react-icons/fi";
import { ASSET_URL } from "../../../../utils/variables";
import CustomTable from "../../../reusable/CustomTable";

export interface MealFormData {
    mealImage: File | null;
    mealType: string;
    date: string;
    time: string;
    description: string;
    portionInfo: string;
}

export type MealAnalysisResult = Record<string, any>;

const nutrition_headers = [
    { name: "Calories (kcal)" },
    { name: "Carbs (g)" },
    { name: "Sugar (g)" },
    { name: "Fiber (g)" },
    { name: "Protein (g)" },
    { name: "Fat (g)" },
]

interface MealStepsProps {
    activeStep: number;
    mealData: MealFormData;
    analysisResult: MealAnalysisResult | null;
    loading: boolean;
    error: string;
    onUpdate: (data: Partial<MealFormData>) => void;
    onNext: () => void;
    onBack: () => void;
    onRetry: () => void;
    onStartAgain: () => void;
}

const stepLabels = [
    "Upload",
    "Meal details",
    "Analysis",
    "Review results",
];

const MealSteps = ({
    activeStep,
    mealData,
    analysisResult,
    loading,
    error,
    onUpdate,
    onNext,
    onBack,
    onRetry,
    onStartAgain,
}: MealStepsProps) => {
    const [imagePreview, setImagePreview] = useState("");
    // Create and clean up the image preview URL.
    useEffect(() => {
        if (!mealData.mealImage) {
            setImagePreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(mealData.mealImage);
        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [mealData.mealImage]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.currentTarget;
        const file = input.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a JPG, PNG, or WEBP image.");
            input.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Image size must be less than 10 MB.");
            input.value = "";
            return;
        }

        onUpdate({ mealImage: file });

        // Allows selecting the same file again later.
        input.value = "";
    };

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
        >
            {/* STEP INDICATOR */}
            <Box overflowX="auto" pb={3} mb={6}>
                <Steps.Root
                    step={activeStep}
                    count={stepLabels.length}
                    // colorPalette="teal"
                    color='#31B0E6'
                    size="sm"
                >
                    <Steps.List>
                        {stepLabels.map((label, index) => (
                            <Steps.Item
                                key={label}
                                index={index}
                                flex="1"
                                minW="90px"
                            >
                                <Steps.Indicator>
                                    <Steps.Status
                                        complete={<FiCheck />}
                                        incomplete={index + 1}
                                        current={index + 1}
                                    />
                                </Steps.Indicator>

                                <Steps.Title>{label}</Steps.Title>
                                <Steps.Separator />
                            </Steps.Item>
                        ))}
                    </Steps.List>
                </Steps.Root>
            </Box>

            {/* ERROR MESSAGE */}
            {error && (
                <Box
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    p={3}
                    borderRadius="md"
                    mb={5}
                >
                    <Text color="red.600" fontSize="sm">
                        {error}
                    </Text>
                </Box>
            )}

            {/* STEP 1: UPLOAD PHOTO */}
            {activeStep === 0 && (
                <Box>
                    <Text fontSize="lg" fontWeight="700" mb={2}>
                        Upload your meal photo
                    </Text>

                    <Text color="gray.500" fontSize="sm" mb={5}>
                        Select a clear food photo. JPG, PNG, or WEBP,
                        maximum 10 MB.
                    </Text>

                    {!mealData.mealImage ? (
                        <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={{ base: 6, md: 10 }}
                            textAlign="center"
                            bg="gray.50"
                        >
                            <VStack gap={3}>
                                <FiUploadCloud
                                    size={40}
                                    color="#31B0E6"
                                />

                                <Text fontWeight="600">
                                    Choose your meal photo
                                </Text>

                                <Text fontSize="sm" color="gray.500">
                                    Browse an image from your device
                                </Text>

                                {/* <Button
                                    as="label"
                                    htmlFor="meal-image"
                                    colorPalette="teal"
                                    cursor="pointer"
                                >
                                    Upload photo
                                </Button>

                                <Input
                                    id="meal-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    display="none"
                                    onChange={handleImageChange}
                                /> */}
                                <Box>
                                    <label
                                        htmlFor="meal-image"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "10px 16px",
                                            borderRadius: "6px",
                                            backgroundColor: "#31B0E6",
                                            color: "white",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Upload photo
                                    </label>

                                    <Input
                                        id="meal-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        display="none"
                                        onChange={handleImageChange}
                                    />
                                </Box>
                            </VStack>
                        </Box>
                    ) : (
                        <Box>
                            <Box
                                maxW="450px"
                                mx="auto"
                                borderRadius="lg"
                                overflow="hidden"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Selected meal"
                                        style={{
                                            width: "100%",
                                            maxHeight: "350px",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </Box>

                            <HStack
                                justify="center"
                                mt={4}
                                flexWrap="wrap"
                                gap={2}
                            >
                                <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    maxW="220px"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                >
                                    {mealData.mealImage.name}
                                </Text>

                                {/* <Button
                                    as="label"
                                    htmlFor="replace-meal-image"
                                    size="sm"
                                    variant="outline"
                                    colorPalette="teal"
                                    cursor="pointer"
                                >
                                    Replace photo
                                </Button>

                                <Input
                                    id="replace-meal-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    display="none"
                                    onChange={handleImageChange}
                                /> */}
                                <Box>
                                    <label
                                        htmlFor="replace-meal-image"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "6px 12px",
                                            border: "1px solid #31B0E6",
                                            borderRadius: "6px",
                                            color: "#31B0E6",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Replace photo
                                    </label>

                                    <Input
                                        id="replace-meal-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        display="none"
                                        onChange={handleImageChange}
                                    />
                                </Box>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="red"
                                    onClick={() =>
                                        onUpdate({ mealImage: null })
                                    }
                                >
                                    Remove
                                </Button>
                            </HStack>
                        </Box>
                    )}
                </Box>
            )}

            {/* STEP 2: MEAL DETAILS */}
            {activeStep === 1 && (
                <Box>
                    <Text fontSize="lg" fontWeight="700" mb={2}>
                        Enter meal details
                    </Text>

                    <Text color="gray.500" fontSize="sm" mb={5}>
                        Provide information to help analyze your meal.
                    </Text>

                    {mealData.mealImage && (
                        <Flex
                            align="center"
                            gap={3}
                            mb={5}
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                        >
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Meal preview"
                                    style={{
                                        width: "75px",
                                        height: "75px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            )}

                            <Box minW={0}>
                                <Text fontWeight="600" fontSize="sm">
                                    Selected meal photo
                                </Text>

                                <Text
                                    color="gray.500"
                                    fontSize="xs"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                >
                                    {mealData.mealImage.name}
                                </Text>
                            </Box>
                        </Flex>
                    )}

                    <VStack align="stretch" gap={4}>
                        <Box>
                            <Text fontWeight="600" fontSize="sm" mb={2}>
                                Meal type *
                            </Text>

                            <select
                                value={mealData.mealType}
                                onChange={(event) =>
                                    onUpdate({
                                        mealType: event.target.value,
                                    })
                                }
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    border: "1px solid #CBD5E0",
                                    borderRadius: "6px",
                                    padding: "0 12px",
                                    background: "white",
                                }}
                            >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
                            </select>
                        </Box>

                        <Flex
                            direction={{ base: "column", md: "row" }}
                            gap={4}
                        >
                            <Box flex="1">
                                <Text fontWeight="600" fontSize="sm" mb={2}>
                                    Date *
                                </Text>

                                <Input
                                    type="date"
                                    value={mealData.date}
                                    onChange={(event) =>
                                        onUpdate({
                                            date: event.target.value,
                                        })
                                    }
                                />
                            </Box>

                            <Box flex="1">
                                <Text fontWeight="600" fontSize="sm" mb={2}>
                                    Time *
                                </Text>

                                <Input
                                    type="time"
                                    value={mealData.time}
                                    onChange={(event) =>
                                        onUpdate({
                                            time: event.target.value,
                                        })
                                    }
                                />
                            </Box>
                        </Flex>

                        <Box>
                            <Text fontWeight="600" fontSize="sm" mb={2}>
                                Meal description
                            </Text>

                            <Textarea
                                placeholder="Example: Rice, dal, chapati, vegetables..."
                                value={mealData.description}
                                onChange={(event) =>
                                    onUpdate({
                                        description: event.target.value,
                                    })
                                }
                                rows={3}
                            />
                        </Box>

                        <Box>
                            <Text fontWeight="600" fontSize="sm" mb={2}>
                                Portion information
                            </Text>

                            <Textarea
                                placeholder="Example: 1 bowl rice, 2 chapatis, 1 cup dal..."
                                value={mealData.portionInfo}
                                onChange={(event) =>
                                    onUpdate({
                                        portionInfo: event.target.value,
                                    })
                                }
                                rows={3}
                            />
                        </Box>
                    </VStack>
                </Box>
            )}

            {/* STEP 3: ANALYSIS */}
            {activeStep === 2 && (
                <Box textAlign="center" py={{ base: 8, md: 12 }}>
                    {loading ? (
                        <>

                            <Spinner size="sm" mb={5}
                                w="65px"
                                h="65px"
                                border="5px solid"
                                borderColor="teal.100"
                                borderTopColor="teal.500" />

                            <Text fontSize="lg" fontWeight="700">
                                Analyzing your meal...
                            </Text>

                            <Text color="gray.500" fontSize="sm" mt={2}>
                                Please wait while the analysis service
                                processes your meal photo.
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text fontSize="lg" fontWeight="700" mb={2}>
                                Analysis could not be completed
                            </Text>

                            <Text color="gray.500" fontSize="sm" mb={5}>
                                {error ||
                                    "Check your connection and try again."}
                            </Text>

                            <Button
                                colorPalette="teal"
                                onClick={onRetry}
                            >
                                <FiRefreshCw />
                                Retry analysis
                            </Button>
                        </>
                    )}
                </Box>
            )}

            {/* STEP 4: REVIEW RESULTS */}
            {activeStep === 3 && (
                <Box>
                    <Flex
                        align="center"
                        gap={2}
                        mb={4}
                        color="teal.600"
                    >
                        <FiCheck size={22} />

                        <Text fontSize="lg" fontWeight="700">
                            Meal analysis completed
                        </Text>
                    </Flex>

                    {/* <Text color="gray.500" fontSize="sm" mb={5}>
                        Review the response returned by your analysis API.
                    </Text> */}

                    {analysisResult ? (
                        <Box
                            bg="gray.50"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="lg"
                            p={4}
                            overflowX="auto"
                        >
                            <Text fontWeight="600" mb={3}>
                                Analysis response
                            </Text>

                            {analysisResult && <Box mt={4}>
                                <Text>Result</Text>
                                <Flex gap={8}>
                                    <Image aspectRatio={'16 / 9'} h='auto' w={'20rem'} onError={(e) => console.log('Image failed:', e.currentTarget.src)} src={`http://localhost:5000/public${analysisResult?.imagePath}`} borderRadius={'7px'} />
                                    <Box
                                        flex={'1'}
                                        bgColor={'#f5f6fa'}
                                        p={2}
                                        borderRadius={6}
                                        border={'2px solid #d5d6da'}
                                        fontWeight={'500'}
                                    >
                                        Detected Items

                                        <DataList.Root orientation="horizontal" mt={3} w={'100%'}>
                                            {analysisResult.foods?.map((item: any) => (
                                                <DataList.Item key={item.name} fontSize={'15px'} justifyContent={'space-between'}>
                                                    <DataList.ItemLabel>{item.name}</DataList.ItemLabel>
                                                    <DataList.ItemValue w={'max-content'} flex={'none'}>{item.grams} g</DataList.ItemValue>
                                                </DataList.Item>
                                            ))}
                                        </DataList.Root>
                                    </Box>
                                </Flex>

                                <Box mt={4}>
                                    <Text>
                                        Nutrition Summary
                                    </Text>

                                    <CustomTable
                                        headers={nutrition_headers}
                                        borderradius="0"
                                    >
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.calories_kcal}</Table.Cell>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.carbs_g}</Table.Cell>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.protein_g}</Table.Cell>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.fat_g}</Table.Cell>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.sugar_g}</Table.Cell>
                                                <Table.Cell px={4} py={3}>{analysisResult?.totals?.fiber_g}</Table.Cell>
                                            </Table.Row>


                                        </Table.Body>
                                    </CustomTable>
                                </Box>

                            </Box>}
                        </Box>
                    ) : (
                        // <Text color="gray.500">
                        //     No analysis result was returned.
                        // </Text>
                        <></>
                    )}

                    <Box mt={5} p={3} bg="orange.50" borderRadius="md">
                        <Text color="orange.800" fontSize="xs">
                            Nutritional values and glucose responses are
                            estimates and are not a replacement for
                            professional medical advice.
                        </Text>
                    </Box>
                </Box>
            )}

            {/* NAVIGATION BUTTONS */}
            <Flex
                justify="space-between"
                align="center"
                mt={8}
                pt={5}
                borderTop="1px solid"
                borderColor="gray.100"
                gap={3}
            >
                <Box>
                    {activeStep === 1 && (
                        <Button variant="outline" onClick={onBack}>
                            <FiArrowLeft />
                            Back
                        </Button>
                    )}

                    {activeStep === 2 && !loading && (
                        <Button variant="outline" onClick={onBack}>
                            <FiArrowLeft />
                            Back to details
                        </Button>
                    )}

                    {activeStep === 3 && (
                        <Button
                            variant="outline"
                            onClick={onStartAgain}
                        >
                            Analyze another meal
                        </Button>
                    )}
                </Box>

                <Box>
                    {activeStep === 0 && (
                        <Button
                            colorPalette="teal"
                            onClick={onNext}
                        >
                            Next
                            <FiArrowRight />
                        </Button>
                    )}

                    {activeStep === 1 && (
                        <Button
                            colorPalette="teal"
                            onClick={onNext}
                            loading={loading}
                            disabled={loading}
                        >
                            Analyze meal
                            <FiArrowRight />
                        </Button>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default MealSteps;
