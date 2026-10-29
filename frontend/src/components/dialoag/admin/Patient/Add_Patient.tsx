import { useState } from "react";
import type { FormEvent } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import CustomDialog from "../../../../components/reusable/CustomDialog";
import { MdOutlineMail } from "react-icons/md";

interface AddPatientProps {
    open: boolean;
    onClose: () => void;
    onAdded?: (patient: {
        name: string;
        phone: string;
        address: string;
        email: string;
        doctorName: string;
    }) => void;
}

const AddPatient = ({ open, onClose, onAdded }: AddPatientProps) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
        doctorName: "Dr. Ananya Rao",
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onAdded?.(formData);
        setShowSuccess(true);
    };

    const handleClose = () => {
        setFormData({
            name: "",
            phone: "",
            address: "",
            email: "",
            doctorName: "Dr. Ananya Rao",
        });
        setShowSuccess(false);
        onClose();
    };

    return (

        <CustomDialog
            isOpen={open}
            setisOpen={(value) => {
                if (!value) {
                    onClose();
                }
            }}
            header="Add Patient"
        >
            <Box p={5}>
                {showSuccess ? (
                    <Box>
                        <Text fontSize="lg" fontWeight="600" color="green.700">
                            Invitation sent
                        </Text>

                        <Text mt={2} fontSize="sm" color="gray.600">
                            {formData.name} was added. We emailed an
                            activation link to {formData.email} so they can
                            set their password.
                        </Text>

                        <Flex justify="flex-end" mt={5}>
                            <Button
                                bg="#2160C4"
                                color="white"
                                _hover={{ bg: "#194FA5" }}
                                onClick={handleClose}
                            >
                                Done
                            </Button>
                        </Flex>
                    </Box>
                ) : (
                    <>
                        <Text fontSize="sm" color="gray.600" mb={5}>
                            The patient receives an email with a link to
                            activate their account.
                        </Text>

                        <form onSubmit={handleSubmit}>
                            <VStack align="stretch" gap={4}>
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={1}>
                                        Patient name *
                                    </Text>
                                    <Input
                                        placeholder="Full name"
                                        value={formData.name}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={1}>
                                        Phone *
                                    </Text>
                                    <Input
                                        placeholder="10-digit mobile number"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        value={formData.phone}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value.replace(/\D/g, ""),
                                            })
                                        }
                                    />
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={1}>
                                        Address *
                                    </Text>
                                    <Input
                                        placeholder="House, street, area, city, PIN"
                                        value={formData.address}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: e.target.value,
                                            })
                                        }
                                    />
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={1}>
                                        Email *
                                    </Text>
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        required
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={1}>
                                        Doctor name
                                    </Text>
                                    <Input
                                        value={formData.doctorName}
                                        readOnly
                                        bg="gray.50"
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        Filled in from your account.
                                    </Text>
                                </Box>

                                <Flex justify="flex-end" gap={3} pt={2}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        bg="#2160C4"
                                        color="white"
                                        _hover={{ bg: "#194FA5" }}

                                    >
                                        <MdOutlineMail />
                                        Add patient
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    </>
                )}
            </Box>
        </CustomDialog >
    );
};

export default AddPatient;