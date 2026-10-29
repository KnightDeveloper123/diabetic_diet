
import {
    Box,
    Button,
    Flex,
    Input,
    Table,
    Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LuPlus, LuChevronRight } from "react-icons/lu";
import AddPatient from "../../../../src/components/dialoag/admin/Patient/Add_Patient";

const Patients = () => {
    const [search, setSearch] = useState("");

    const patients = [
        {
            id: 1,
            name: "Ravi Kulkarni",
            email: "ravi.k@example.com",
            phone: "+91 98200 11234",
            address: "Kothrud, Pune",
        },
        {
            id: 2,
            name: "Meera Iyer",
            email: "meera.iyer@example.com",
            phone: "+91 98450 22871",
            address: "Indiranagar, Bengaluru",
        },
        {
            id: 3,
            name: "Sanjay Patel",
            email: "sanjay.p@example.com",
            phone: "+91 99090 45012",
            address: "Navrangpura, Ahmedabad",
        },
        {
            id: 4,
            name: "Fatima Shaikh",
            email: "fatima.s@example.com",
            phone: "+91 97690 33310",
            address: "Bandra West, Mumbai",
        },
        {
            id: 5,
            name: "Arjun Menon",
            email: "arjun.menon@example.com",
            phone: "+91 94470 18822",
            address: "Kakkanad, Kochi",
        },
    ];
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
    const filteredPatients = useMemo(() => {
        const value = search.toLowerCase().trim();

        return patients.filter((patient) =>
            [
                patient.name,
                patient.email,
                patient.phone,
                patient.address,
            ].some((field) => field.toLowerCase().includes(value))
        );
    }, [search]);

    // const handleAddPatient = () => {
    //     // Connect your Add Patient form or dialog here.
    //     console.log("Add patient clicked");
    // };

    // const handleViewPatient = (patient) => {
    //     // Connect your patient details route here.
    //     console.log("Selected patient:", patient);
    // };

    return (
        <Flex
            direction="column"
            gap={5}
            w="100%"
            minH="100vh"
            bg="#FAFAFA"
            p={{ base: 3, md: 5, lg: 6 }}
            fontFamily="Arial, sans-serif"
        >
            <AddPatient
                open={isAddPatientOpen}
                onClose={() => setIsAddPatientOpen(false)}
            />

            {/* Page heading */}
            <Flex
                justify="space-between"
                align={{ base: "stretch", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={3}
            >
                <Text fontSize={{ base: "22px", md: "24px" }} fontWeight="600" color="#1E293B">
                    Patients
                </Text>

                <Button
                    bg="#2160C4"
                    color="white"
                    borderRadius="7px"
                    size="sm"
                    px={4}
                    h="38px"
                    alignSelf={{ base: "flex-start", sm: "auto" }}
                    onClick={() => setIsAddPatientOpen(true)}
                    _hover={{ bg: "#194FA5" }}
                >
                    <LuPlus />
                    Add patient
                </Button>
            </Flex>

            {/* Patients card */}
            <Box
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="12px"
                overflow="hidden"
                w="100%"
                minW="0"
                boxShadow="0 1px 2px rgba(15, 23, 42, 0.05)"
            >
                {/* Heading and search */}
                <Flex
                    p={{ base: 3, md: 4 }}
                    justify="space-between"
                    align={{ base: "stretch", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={4}
                >
                    <Box>
                        <Text fontSize="16px" fontWeight="600" color="#1E293B">
                            Your patients
                        </Text>
                        <Text fontSize="13px" color="#64748B" mt={1}>
                            {filteredPatients.length} patients
                        </Text>
                    </Box>

                    <Flex
                        align="center"
                        gap={2}
                        border="1px solid #94A3B8"
                        borderRadius="7px"
                        px={3}
                        w={{ base: "100%", md: "300px" }}
                        maxW="100%"
                        h="40px"
                        _focusWithin={{
                            borderColor: "#2160C4",
                            boxShadow: "0 0 0 1px #2160C4",
                        }}
                    >
                        <CiSearch size={19} color="#64748B" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search patients..."
                            fontSize="13px"
                            color="#1E293B"
                            h="100%"
                            minW="0"
                            border="none"
                            outline="none"
                            _focusVisible={{ boxShadow: "none" }}
                            _placeholder={{ color: "#64748B" }}
                        />
                    </Flex>
                </Flex>

                {/* MOBILE: Patient cards */}
                <Box display={{ base: "block", md: "none" }} p={3} pt={0}>
                    <Flex direction="column" gap={3}>
                        {filteredPatients.map((patient) => (
                            <Box
                                key={patient.id}
                                border="1px solid #E2E8F0"
                                borderRadius="10px"
                                p={3}
                                minW="0"
                            >
                                <Text fontWeight="600" color="#1E293B" fontSize="15px">
                                    {patient.name}
                                </Text>

                                <Text
                                    fontSize="13px"
                                    color="#64748B"
                                    mt={2}
                                    overflowWrap="anywhere"
                                >
                                    {patient.email}
                                </Text>

                                <Text fontSize="13px" color="#475569" mt={1}>
                                    {patient.phone}
                                </Text>

                                <Text fontSize="13px" color="#475569" mt={1}>
                                    {patient.address}
                                </Text>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    mt={3}
                                    w="100%"
                                >
                                    View patient
                                    <LuChevronRight />
                                </Button>
                            </Box>
                        ))}

                        {filteredPatients.length === 0 && (
                            <Text textAlign="center" py={6} color="#64748B" fontSize="14px">
                                No patients found.
                            </Text>
                        )}
                    </Flex>
                </Box>

                {/* TABLET AND DESKTOP: Responsive table */}
                <Box
                    display={{ base: "none", md: "block" }}
                    w="100%"
                    overflowX="auto"
                >
                    <Table.Root
                        size="sm"
                        variant="line"
                        minW={{ md: "760px", lg: "100%" }}
                        tableLayout="auto"
                    >
                        <Table.Header>
                            <Table.Row bg="#EDF1F7">
                                <Table.ColumnHeader px={4} py={3}>
                                    PATIENT NAME
                                </Table.ColumnHeader>
                                <Table.ColumnHeader px={4} py={3}>
                                    EMAIL
                                </Table.ColumnHeader>
                                <Table.ColumnHeader px={4} py={3}>
                                    PHONE
                                </Table.ColumnHeader>
                                <Table.ColumnHeader px={4} py={3}>
                                    ADDRESS
                                </Table.ColumnHeader>
                                <Table.ColumnHeader px={4} py={3} textAlign="right">
                                    ACTION
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {filteredPatients.map((patient) => (
                                <Table.Row key={patient.id}>
                                    <Table.Cell px={4} py={3} whiteSpace="nowrap">
                                        {patient.name}
                                    </Table.Cell>
                                    <Table.Cell px={4} py={3}>
                                        {patient.email}
                                    </Table.Cell>
                                    <Table.Cell px={4} py={3} whiteSpace="nowrap">
                                        {patient.phone}
                                    </Table.Cell>
                                    <Table.Cell px={4} py={3}>
                                        {patient.address}
                                    </Table.Cell>
                                    <Table.Cell px={4} py={3} textAlign="right">
                                        <Button size="xs" variant="outline" whiteSpace="nowrap">
                                            View patient
                                            <LuChevronRight />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}

                            {filteredPatients.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5} textAlign="center" py={8}>
                                        No patients found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </Flex>
    );
};

export default Patients;
