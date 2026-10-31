
import { useRef, useState } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Input,
    HStack,
} from "@chakra-ui/react";

import {
    FiCamera,
    FiActivity,
    FiSun,
    FiTrash2,
    FiArrowRight,
    FiUploadCloud,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const AnalyzeMeal = () => {
    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");

    const steps = [
        "Upload",
        "Meal details",
        "Analyze",
        "Review results",
    ];

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload a JPG, PNG, WEBP or HEIC image.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Image size must be less than 10 MB.");
            return;
        }

        if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setError("");
        setSelectedFile(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    const handleSamplePhoto = async () => {
        try {
            setError("");

            const response = await fetch("/sample-meal.jpg");

            if (!response.ok) {
                throw new Error("Sample image not found");
            }

            const blob = await response.blob();

            const file = new File(
                [blob],
                "sample-meal.jpg",
                { type: blob.type || "image/jpeg" }
            );

            if (preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }

            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        } catch {
            setError(
                "Sample image not found. Add sample-meal.jpg to your public folder."
            );
        }
    };

    const handleRemoveImage = () => {
        if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(null);
        setPreview("");
        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (cameraInputRef.current) {
            cameraInputRef.current.value = "";
        }
    };

    const handleContinue = () => {
        if (!selectedFile) return;

        navigate("/patient/meal-details", {
            state: { mealImage: selectedFile },
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
            <Flex flex="1" direction="column" minW={0}>
                <Box
                    p={{ base: 4, md: 6 }}
                    maxW="1200px"
                    w="100%"
                    mx="auto"
                >
                    <Box mb={6}>
                        <HeadingText />
                    </Box>

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
                                    bg={index === 0 ? "#244A78" : "#DCE2EA"}
                                    mb={3}
                                />

                                <HStack gap={2}>
                                    <Flex
                                        w="22px"
                                        h="22px"
                                        flexShrink={0}
                                        borderRadius="full"
                                        border={
                                            index === 0
                                                ? "none"
                                                : "1px solid #B9C4D2"
                                        }
                                        bg={
                                            index === 0
                                                ? "#244A78"
                                                : "transparent"
                                        }
                                        color={
                                            index === 0
                                                ? "white"
                                                : "#64748B"
                                        }
                                        justify="center"
                                        align="center"
                                        fontSize="12px"
                                        fontWeight="600"
                                    >
                                        {index + 1}
                                    </Flex>

                                    <Text
                                        fontSize="sm"
                                        color="#475569"
                                        fontWeight={
                                            index === 0 ? "600" : "400"
                                        }
                                        whiteSpace="nowrap"
                                    >
                                        {step}
                                    </Text>
                                </HStack>
                            </Box>
                        ))}
                    </Flex>

                    <Box
                        bg="white"
                        border="1px solid #E2E8F0"
                        borderRadius="14px"
                        boxShadow="0 2px 5px rgba(0,0,0,0.03)"
                        overflow="hidden"
                    >
                        <Box p={{ base: 4, md: 6 }}>
                            <Text
                                fontSize="lg"
                                fontWeight="600"
                                mb={5}
                            >
                                Add a photo
                            </Text>

                            <Input
                                type="file"
                                ref={fileInputRef}
                                display="none"
                                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                                onChange={handleFileChange}
                            />

                            <Input
                                type="file"
                                ref={cameraInputRef}
                                display="none"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                            />

                            <Flex
                                minH={{ base: "270px", md: "300px" }}
                                border="2px dashed #A8B4C5"
                                borderRadius="12px"
                                bg="#F7F8FC"
                                direction="column"
                                justify="center"
                                align="center"
                                textAlign="center"
                                px={4}
                                py={6}
                                position="relative"
                            >
                                {preview ? (
                                    <Box w="100%">
                                        <Image
                                            src={preview}
                                            alt="Selected meal"
                                            maxH="200px"
                                            maxW="100%"
                                            objectFit="contain"
                                            mx="auto"
                                            borderRadius="8px"
                                        />

                                        <Text
                                            mt={4}
                                            fontSize="md"
                                            fontWeight="600"
                                            color="#334155"
                                        >
                                            {selectedFile?.name}
                                        </Text>

                                        <Button
                                            size="md"
                                            mt={3}
                                            colorPalette="red"
                                            variant="outline"
                                            onClick={handleRemoveImage}
                                        >
                                            <FiTrash2 size={18} />
                                            Remove photo
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Flex
                                            w="52px"
                                            h="52px"
                                            borderRadius="full"
                                            bg="#DDF4F0"
                                            color="#168A7A"
                                            align="center"
                                            justify="center"
                                            mb={4}
                                            fontSize="24px"
                                        >
                                            <FiUploadCloud />
                                        </Flex>

                                        <Text
                                            fontSize="md"
                                            fontWeight="700"
                                            color="#263445"
                                            mb={2}
                                        >
                                            Drag and drop a meal photo here
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="#64748B"
                                            mb={5}
                                        >
                                            JPG, PNG, WEBP or HEIC · up to 10 MB ·
                                            one plate per photo works best
                                        </Text>

                                        <Flex
                                            gap={3}
                                            wrap="wrap"
                                            justify="center"
                                        >
                                            <Button
                                                size="md"
                                                bg="#244A78"
                                                color="white"
                                                fontSize="sm"
                                                px={5}
                                                _hover={{ bg: "#18395F" }}
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <FiUploadCloud size={18} />
                                                Browse files
                                            </Button>

                                            <Button
                                                size="md"
                                                bg="white"
                                                color="#334155"
                                                border="1px solid #CBD5E1"
                                                fontSize="sm"
                                                px={5}
                                                _hover={{ bg: "#F1F5F9" }}
                                                onClick={() =>
                                                    cameraInputRef.current?.click()
                                                }
                                            >
                                                <FiCamera size={18} />
                                                Take photo
                                            </Button>

                                            <Button
                                                size="md"
                                                variant="ghost"
                                                color="#244A78"
                                                fontSize="sm"
                                                px={4}
                                                onClick={handleSamplePhoto}
                                            >
                                                Use sample photo
                                            </Button>
                                        </Flex>
                                    </>
                                )}
                            </Flex>

                            {error && (
                                <Text
                                    color="red.500"
                                    fontSize="sm"
                                    mt={3}
                                >
                                    {error}
                                </Text>
                            )}

                            <Flex
                                mt={5}
                                gap={5}
                                wrap="wrap"
                                color="#64748B"
                            >
                                <HStack gap={2}>
                                    <FiSun size={17} />
                                    <Text fontSize="sm">
                                        Good light, shot from above
                                    </Text>
                                </HStack>

                                <HStack gap={2}>
                                    <FiCamera size={17} />
                                    <Text fontSize="sm">
                                        Whole plate in frame, before eating
                                    </Text>
                                </HStack>

                                <HStack gap={2}>
                                    <FiActivity size={17} />
                                    <Text fontSize="sm">
                                        Include a spoon or hand for scale
                                    </Text>
                                </HStack>
                            </Flex>
                        </Box>

                        <Flex
                            borderTop="1px solid #E5E7EB"
                            px={{ base: 4, md: 6 }}
                            py={4}
                            align="center"
                            justify="space-between"
                            gap={3}
                            wrap="wrap"
                        >
                            <Text
                                fontSize="sm"
                                color="#64748B"
                            >
                                Photos are stored privately and shared only
                                with your assigned doctor.
                            </Text>

                            <Button
                                size="md"
                                bg={selectedFile ? "#244A78" : "#94A3B8"}
                                color="white"
                                fontSize="sm"
                                px={6}
                                disabled={!selectedFile}
                                _hover={{
                                    bg: selectedFile ? "#18395F" : "#94A3B8",
                                }}
                                onClick={handleContinue}
                            >
                                Continue
                                <FiArrowRight size={18} />
                            </Button>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

const HeadingText = () => (
    <>
        <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            color="#1E293B"
            mb={2}
            fontFamily="Arial, sans-serif"
        >
            Analyze a meal
        </Text>

        <Text
            fontSize="md"
            color="#64748B"
            fontFamily="Arial, sans-serif"
        >
            Take or upload a photo. You can check and correct everything
            before it’s saved.
        </Text>
    </>
);

export default AnalyzeMeal;
