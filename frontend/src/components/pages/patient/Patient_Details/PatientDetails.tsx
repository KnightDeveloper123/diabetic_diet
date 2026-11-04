
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    Heading,
    HStack,
    // VStack,

    Separator
} from "@chakra-ui/react";

import { IoWarningOutline } from "react-icons/io5";
// import { FcApproval } from "react-icons/fc";

import WeeklyMealChart from "../../../../components/ui/charts/WeeklyMealChart";
import { FcApproval } from "react-icons/fc";
import Icons from "../../../utils/Icons";
import { useAuth } from "../../../context/AuthContext";
import Reports from "../reports/Reports";
// Weekly meal data
const weeklyData = [
    { day: "Mon", date: "19 Oct", carbs: 160 },
    { day: "Tue", date: "20 Oct", carbs: 180 },
    { day: "Wed", date: "21 Oct", carbs: 190 },
    { day: "Thu", date: "22 Oct", carbs: 220 },
    { day: "Fri", date: "23 Oct", carbs: 170 },
    { day: "Sat", date: "24 Oct", carbs: 210 },
    { day: "Sun", date: "25 Oct", carbs: 144 },
];

const PatientDetails = () => {
    const { user } =useAuth();
    return (
        <Box w="100%" p={{ base: 3, md: 5 }} bg="white" borderRadius={10}>

            {/* Patient Header */}
            <Box mb={5}>
                <Flex gap={4} justify={'flex-start'} align={'center'}>
                    <Icons.Back />
                <Heading size="lg" color="gray.800">
                    {user?.name}
                </Heading>
                </Flex>

                <Text fontSize="md" color="gray.500" mt={1}>
                    Patient Details
                </Text>
            </Box>


            {/* Warning Section */}
            {/* <Box
                w="100%"
                bg="red.50"
                border="1px solid"
                borderColor="red.300"
                borderRadius="lg"
                p={{ base: 3, md: 4 }}
                mb={5}
            >
                <Text
                    fontSize="md"
                    fontWeight="bold"
                    color="black.700"
                    mb={3}
                >
                    Above threshold on 2 of 7 days this week
                </Text>

                <VStack align="stretch" gap={2}>
                    <HStack align="flex-start" gap={2}>
                        <Box color="red.600" mt="2px">
                            <IoWarningOutline size={19} />
                        </Box>

                        <Text fontSize="md" fontWeight="xl" color="gray.700">
                            Thu 22 Oct exceeded the 200 g daily threshold.
                        </Text>
                    </HStack>


                </VStack>
            </Box> */}

           

            {/* Contact Information */}
            <Box
                w="100%"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
                mb={5}
            >
                <Heading size="2xl" color="gray.800" mb={4}>
                    Contact information
                </Heading>

                {/* <Separator mb={4} /> */}

                <Grid
                    templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    }}
                    gap={5}
                >
                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1} fontWeight="medium">
                            Email
                        </Text>
                        <Text fontSize="md" color="gray.800" fontWeight="medium">
                            {user?.email}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1} fontWeight="medium">
                            Phone
                        </Text>
                        <Text fontSize="md" color="gray.800" fontWeight="medium">
                            +91 {user?.phone}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1} fontWeight="medium">
                            Address
                        </Text>
                        <Text fontSize="md" color="gray.800" fontWeight="medium">
                            {user?.address}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1} fontWeight="medium">
                            Doctor
                        </Text>
                        <Text fontSize="md" color="gray.800" fontWeight="medium">
                           {user?.name}
                        </Text>
                    </GridItem>
                </Grid>
            </Box>

            <Reports />

            {/* Meals Recorded */}

            {/* Meals Recorded */}
            {/* <Box
                w="100%"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
                mb={5}
            >
               
                <Flex
                    justify="space-between"
                    align={{ base: "flex-start", sm: "center" }}
                    direction={{ base: "column", sm: "row" }}
                    gap={2}
                    mb={4}
                >
                    <Heading size="md" color="gray.700">

                    </Heading>

                    <Text fontSize="md" color="gray.500">
                        19–25 Oct 2026
                    </Text>
                </Flex>

              
                <Grid
                    templateColumns={{
                        base: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    }}
                    gap={{ base: 3, md: 4 }}
                    w="100%"
                >
                    
                    <GridItem>
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="lg"
                            p={{ base: 3, md: 5 }}
                            minH={{ base: "auto", md: "170px" }}
                            h="100%"
                        >
                            <Text fontSize="md" color="gray.500" mb={3}>
                                Meals recorded
                            </Text>

                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
                                21
                            </Text>

                            <Text fontSize="sm" color="gray.500" mt={2}>
                                19–25 Oct 2026
                            </Text>
                        </Box>
                    </GridItem>

                    
                    <GridItem>
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="lg"
                            p={{ base: 3, md: 5 }}
                            minH={{ base: "auto", md: "170px" }}
                            h="100%"
                        >
                            <Text fontSize="md" color="gray.500" mb={3}>
                                Daily average
                            </Text>

                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.900">
                                182g
                            </Text>

                            <HStack
                                gap={2}
                                bg="green.50"
                                px={3}
                                py={2}
                                borderRadius="md"
                                mt={3}
                                width="fit-content"
                                maxW="100%"
                            >
                                <FcApproval size={20} />
                                <Text fontSize="sm" fontWeight="medium" color="#5aa19c">
                                    Within threshold
                                </Text>
                            </HStack>

                            <Text fontSize="sm" color="gray.500" mt={2}>
                                Threshold 200 g
                            </Text>
                        </Box>
                    </GridItem>

                    
                    <GridItem>
                        <Box
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="lg"
                            p={{ base: 3, md: 5 }}
                            minH={{ base: "auto", md: "170px" }}
                            h="100%"
                        >
                            <Text fontSize="md" color="gray.500" mb={3}>
                                Days above threshold
                            </Text>

                            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="red.600">
                                2
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="red.700"
                                bg="red.50"
                                px={3}
                                py={2}
                                borderRadius="md"
                                mt={3}
                                width="fit-content"
                            >
                                Above threshold
                            </Text>
                        </Box>
                    </GridItem>
                </Grid>


                
                <Box mt={6}>
                    <WeeklyMealChart data={weeklyData} />
                </Box>

              
                <Separator my={5} />

               
                <Box
                    mt={6}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={{ base: 4, md: 5 }}
                    bg="white"
                >
                   
                    <Heading size="md" fontWeight="bold" color="gray.800" mb={5}>
                        Latest AI Analysis
                    </Heading>

                   
                    <Flex
                        justify="space-between"
                        align="center"
                        gap={3}
                        mb={4}
                    >
                        <Box>
                            <Text fontSize="md" fontWeight="bold" color="gray.800">
                                Lunch
                            </Text>

                            <Text fontSize="sm" color="gray.500" mt={1}>
                                Tue 27 Oct 2026
                            </Text>
                        </Box>
                    </Flex>

                   
                    <Box
                        w="100%"
                        bg="#e3f3f2"
                        borderRadius="md"
                        p={3}
                        mb={5}
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            flexWrap="wrap"
                            gap={2}
                        >
                            <HStack gap={2}>
                                <FcApproval size={20} />

                                <Text
                                    fontSize="sm"
                                    fontWeight="bold"
                                    color="#5aa19c"
                                >
                                    Analysis complete
                                </Text>
                            </HStack>

                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="gray.500"
                            >
                                27 Oct 2026, 13:12
                            </Text>
                        </Flex>
                    </Box>

                    <Separator mb={4} />

                  
                    <Grid
                        templateColumns="1fr"
                        columnGap={6}
                        rowGap={5}
                    >
                        
                        <GridItem>
                            <Flex justify="space-between" align="flex-start" gap={3}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="gray.500"
                                >
                                    Detected items
                                </Text>

                                <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="medium"
                                    textAlign="right"
                                >
                                    Rice, dal, mixed vegetables
                                </Text>
                            </Flex>
                        </GridItem>
                        <Separator my={1} />

                       
                        <GridItem>
                            <Flex justify="space-between" align="flex-start" gap={2}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.500">
                                    Estimated carbohydrates
                                </Text>

                                <HStack align="center" gap={2}>
                                    <Text fontSize="md" color="#B42318" fontWeight="semibold">
                                        62 g
                                    </Text>

                                    <Flex
                                        align="center"
                                        gap={1}
                                        color="#B42318"
                                        bg="#e8b3b1"
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        whiteSpace="nowrap"
                                    >
                                        <IoWarningOutline size={14} />
                                        <Text fontSize="xs" fontWeight="medium">
                                            Above threshold
                                        </Text>
                                    </Flex>
                                </HStack>
                            </Flex>
                        </GridItem>
                        <Separator my={1} />

                        
                        <GridItem>
                            <Flex justify="space-between" align="center" gap={3}>
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="gray.500"
                                >
                                    Estimated calories
                                </Text>

                                <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="medium"
                                >
                                    480 kcal
                                </Text>
                            </Flex>
                        </GridItem>
                    </Grid>
                    <Separator my={1} />

                    
                    <Box
                        bg="gray.50"
                        borderRadius="md"
                        p={3}
                        w="100%"
                    >
                       

                        <Text
                            fontSize="xs"
                            color="gray.500"
                            mt={2}
                            lineHeight="1.6"
                        >
                            Illustrative sample. In the product this panel lists only
                            the fields returned by the configured AI service.
                        </Text>
                    </Box>
                </Box>

            </Box> */}

        </Box>
    );
};

export default PatientDetails;
