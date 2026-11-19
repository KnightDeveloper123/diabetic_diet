
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    Heading,
    // HStack,
    // VStack,

    // Separator
} from "@chakra-ui/react";

// import { IoWarningOutline } from "react-icons/io5";
// import { FcApproval } from "react-icons/fc";

// import WeeklyMealChart from "../../../../components/ui/charts/WeeklyMealChart";
// import { FcApproval } from "react-icons/fc";
import Icons from "../../../utils/Icons";
import { useAuth } from "../../../context/AuthContext";
import Reports from "../reports/Reports";
import { usePatient } from "../../../context/PatientContext";
import { useNavigate, useParams } from "react-router-dom";


import { useEffect } from "react";

// Inside PatientDetails component

const PatientDetails = () => {
    const { id } = useParams();

    const navigate = useNavigate()

    const { user } = useAuth();

    const { fetchPatientById, patientById } = usePatient();

    // Fetch patient details only when logged-in user is a doctor
    useEffect(() => {
        if (user?.role === "doctor" && id) {
            fetchPatientById(id);
        }
    }, [user?.role, id, fetchPatientById]);

    // Select details based on logged-in role
    const patientData =
        user?.role === "patient" ? user : patientById;

    return (
        <Box w="100%" p={{ base: 3, md: 5 }} bg="white" borderRadius={10}>

            {/* Patient Header */}
            <Box mb={5}>
                <Flex gap={4} justify="flex-start" align="center" onClick={() => navigate(-1)}>
                    <Icons.Back />

                    <Heading size="lg" color="gray.800">
                        {patientData?.name}
                    </Heading>
                </Flex>

                <Text fontSize="md" color="gray.500" mt={1}>
                    Patient Details
                </Text>
            </Box>

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

                <Grid
                    templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    }}
                    gap={5}
                >
                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1}>
                            Email
                        </Text>
                        <Text fontSize="md" color="gray.800">
                            {patientData?.email}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1}>
                            Phone
                        </Text>
                        <Text fontSize="md" color="gray.800">
                            +91 {patientData?.phone}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1}>
                            Address
                        </Text>
                        <Text fontSize="md" color="gray.800">
                            {patientData?.address}
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Text fontSize="md" color="gray.500" mb={1}>
                            Doctor
                        </Text>
                        <Text fontSize="md" color="gray.800">
                            {user?.role === "patient"
                                ? user?.name
                                : patientById?.doctor_name}
                        </Text>
                    </GridItem>
                </Grid>
            </Box>

            <Reports />

        </Box>
    );
};

export default PatientDetails;

