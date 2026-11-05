
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    // VStack,
} from "@chakra-ui/react";
import { MdOutlineMail } from "react-icons/md";
import { useForm } from "react-hook-form";

import CustomDialog from "../../../../components/reusable/CustomDialog";
import { useDoctor } from "../../../context/DoctorContext";
import useFetch from "../../../hooks/uesFetch";
import CustomCombobox from "../../../reusable/CustomCombobox";

interface PatientFormData {
    name: string;
    phone: string;
    address: string;
    email: string;
    doctor_id: string | string[];
    role?: string;
}

interface AddPatientProps {
    open: boolean;
    onClose: () => void;
    afterFunction?: () => void;
    onAdded?: (patient: {
        name: string;
        phone: string;
        address: string;
        email: string;
        doctor_id: string | string[];
        role: string;
    }) => void;
}

const AddPatient = ({ open, onClose, onAdded, afterFunction }: AddPatientProps) => {
    const { fetchAllDoctor, allDoctor } = useDoctor();
    const { request } = useFetch();

    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<PatientFormData | null>(
        null
    );
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PatientFormData>({
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            email: "",
            doctor_id: "",
            role: "patient",
        },
    });

    useEffect(() => {
        if (open) {
            fetchAllDoctor({ page: 1, limit: 10, search: "" });
        }
    }, [open, fetchAllDoctor]);

    const selectedDoctor = (allDoctor?.data || []).map((doctor) => ({
        label: doctor.name,
        value: String(doctor.id),
    }));

    const onSubmit = async (data: PatientFormData) => {
        setSubmitError("");

        const finalData = {
            ...data,
            doctor_id: Array.isArray(data.doctor_id)
                ? data.doctor_id[0] || ""
                : data.doctor_id,
            role: "patient",
        };

        try {
            const response = await request({
                url: "/api/health/add",
                method: "POST",
                body: finalData,
                withLoader: true,
            });

            if (response?.status === 1) {
                setSuccessData(finalData);
                setShowSuccess(true);
                onAdded?.(finalData);

                reset({
                    name: "",
                    phone: "",
                    address: "",
                    email: "",
                    doctor_id: "",
                    role: "patient",
                });
                afterFunction?.();
            } else {
                setSubmitError(
                    response?.message || "Unable to add patient."
                );
            }
        } catch (error: unknown) {
            console.error(error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        }
    };

    const handleClose = () => {
        reset();
        setShowSuccess(false);
        setSuccessData(null);
        setSubmitError("");
        onClose();
    };

    return (
        <CustomDialog
            isOpen={open}
            setisOpen={(value) => {
                if (!value) {
                    handleClose();
                }
            }}
            header="Add Patient"
        >
            <Box p={2}>
                {showSuccess ? (
                    <Box>
                        <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="green.700"
                        >
                            Invitation sent
                        </Text>

                        <Text mt={2} fontSize="sm" color="gray.600">
                            {successData?.name} was added. An activation
                            link was sent to {successData?.email}.
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
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            The patient receives an email with a link to
                            activate their account.
                        </Text>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* <VStack align="stretch" gap={4}> */}
                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1}>
                                    Patient name *
                                </Text>
                                <Input
                                    placeholder="Full name"
                                    {...register("name", {
                                        required: "Patient name is required",
                                        pattern: {
                                            value: /^[A-Za-z ]+$/,
                                            message: "Only letters are allowed",
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <Text color="red.500" fontSize="xs">
                                        {errors.name.message}
                                    </Text>
                                )}
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
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Enter a valid 10-digit phone number",
                                        },
                                        onChange: (e) => {
                                            e.target.value = e.target.value
                                                .replace(/[^0-9]/g, "")
                                                .slice(0, 10);
                                        },
                                    })}
                                />
                                {errors.phone && (
                                    <Text color="red.500" fontSize="xs">
                                        {errors.phone.message}
                                    </Text>
                                )}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1}>
                                    Address *
                                </Text>
                                <Input
                                    placeholder="House, street, area, city, PIN"
                                    {...register("address", {
                                        required: "Address is required",
                                    })}
                                />
                                {errors.address && (
                                    <Text color="red.500" fontSize="xs">
                                        {errors.address.message}
                                    </Text>
                                )}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1}>
                                    Email *
                                </Text>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <Text color="red.500" fontSize="xs">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1}>
                                    Doctor name
                                </Text>

                                <CustomCombobox
                                    name="doctor_id"
                                    values={selectedDoctor}
                                    control={control}
                                />

                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Select the doctor assigned to this patient.
                                </Text>
                            </Box>

                            {submitError && (
                                <Text color="red.500" fontSize="sm">
                                    {submitError}
                                </Text>
                            )}

                            <Flex justify="flex-end" gap={3} pt={2}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    bg="#2160C4"
                                    color="white"
                                    _hover={{ bg: "#194FA5" }}
                                    loading={isSubmitting}
                                >
                                    <MdOutlineMail />
                                    Add patient
                                </Button>
                            </Flex>

                        </form>
                    </>
                )}
            </Box>
        </CustomDialog>
    );
};

export default AddPatient;
