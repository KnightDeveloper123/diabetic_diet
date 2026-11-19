
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Input,
    Text,
} from "@chakra-ui/react";

import { IoWarningOutline } from "react-icons/io5";
import useFetch from "../../hooks/uesFetch";
import { useAuth } from "../../context/AuthContext";

interface ProfileForm {
    name: string;
    email: string;
    phone: string;
    doctor_id: string;
    address: string;
    doctor_name: string;
}

type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;

const ProfileSettings = () => {
    const { loading, request } = useFetch();
    const { showAlert, user, setUser } = useAuth();

    const initialProfile: ProfileForm = {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        doctor_id: String(user?.doctor_id ?? ""),
        doctor_name: user?.doctor_name ?? "",
        address: user?.address ?? "",
    };

    const [profile, setProfile] = useState<ProfileForm>(initialProfile);

    const [savedProfile, setSavedProfile] =
        useState<ProfileForm>(initialProfile);

    const [errors, setErrors] = useState<ProfileErrors>({});

    const hasUnsavedChanges =
        JSON.stringify(profile) !== JSON.stringify(savedProfile);

    // Handle input changes
    const handleChange = (
        field: keyof ProfileForm,
        value: string
    ) => {
        let updatedValue = value;

        // Name and doctor name: only letters and spaces
        if (field === "name" || field === "doctor_name") {
            updatedValue = value
                .replace(/[^A-Za-z ]/g, "")
                .slice(0, 50);
        }

        // Phone: only numbers, maximum 10 digits
        if (field === "phone") {
            updatedValue = value.replace(/\D/g, "").slice(0, 10);
        }

        // Address: maximum 250 characters
        if (field === "address") {
            updatedValue = value.slice(0, 250);
        }

        setProfile((prev) => ({
            ...prev,
            [field]: updatedValue,
        }));

        // Clear field error while typing
        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Cancel changes
    const handleCancel = () => {
        setProfile(savedProfile);
        setErrors({});
    };

    // Update profile when user data changes
    useEffect(() => {
        if (!user) return;

        const updatedProfile: ProfileForm = {
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            doctor_id: String(user.doctor_id ?? ""),
            doctor_name: user.doctor_name ?? "",
            address: user.address ?? "",
        };

        setProfile(updatedProfile);
        setSavedProfile(updatedProfile);
        setErrors({});
    }, [user]);

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: ProfileErrors = {};

        // Name validation
        if (!profile.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z]+(?:[ ]+[A-Za-z]+)*$/.test(profile.name.trim())) {
            newErrors.name = "Only letters and spaces are allowed";
        }

        // Email validation
        if (!profile.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
        ) {
            newErrors.email = "Enter a valid email address";
        }

        // Phone validation
        if (!profile.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(profile.phone)) {
            newErrors.phone = "Phone number must contain exactly 10 digits";
        }

        // Doctor name validation
        if (user?.role === "patient" && profile.doctor_name.trim()) {
            if (!/^[A-Za-z]+(?:[ ]+[A-Za-z]+)*$/.test(profile.doctor_name.trim())) {
                newErrors.doctor_name = "Only letters and spaces are allowed";
            }
        }

        // Address validation
        if (!profile.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Save profile
    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const response = await request({
                url: "/api/health/edit-profile",
                method: "PUT",
                body: {
                    ...profile,
                    id: user?.id ?? "",
                },
                withLoader: true,
            });

            if (response?.status === 1) {
                setSavedProfile({ ...profile });

                setUser((prev) =>
                    prev
                        ? {
                            ...prev,
                            name: profile.name,
                            phone: profile.phone,
                            address: profile.address,
                            email: profile.email,
                            doctor_id: profile.doctor_id,
                            doctor_name: profile.doctor_name,
                        }
                        : prev
                );

                setErrors({});

                showAlert("Profile updated successfully!", "success");
            } else {
                showAlert(
                    response?.message || "Unable to update profile",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showAlert("Something went wrong. Please try again.", "error");
        }
    };

    // Reusable input field
    const renderField = (
        label: string,
        field: keyof ProfileForm,
        placeholder: string,
        type = "text",
        disabled = false,
        maxLength = 50
    ) => (
        <Box>
            <Text
                mb={2}
                fontSize="14px"
                fontWeight="500"
                color="#334155"
                fontFamily="Arial, sans-serif"
            >
                {label}
            </Text>

            <Input
                type={type}
                value={profile[field]}
                maxLength={maxLength}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                h="44px"
                border="1px solid"
                borderColor={errors[field] ? "red.500" : "#CBD5E1"}
                borderRadius="7px"
                fontSize="14px"
                bg={disabled ? "#F1F5F9" : "white"}
                color="#1E293B"
                _placeholder={{ color: "#94A3B8" }}
                _focus={{
                    borderColor: errors[field] ? "red.500" : "#2160C4",
                    boxShadow: errors[field]
                        ? "0 0 0 1px #E53E3E"
                        : "0 0 0 1px #2160C4",
                }}
            />

            {errors[field] && (
                <Text color="red.500" fontSize="xs" mt={1}>
                    {errors[field]}
                </Text>
            )}
        </Box>
    );

    return (
        <Box
            w="100%"
            minH="100vh"
            bg="#FAFAFA"
            p={{ base: 4, md: 6 }}
            fontFamily="Arial, sans-serif"
        >
            {/* Page heading */}
            <Heading
                fontSize="24px"
                fontWeight="600"
                color="#1E293B"
                mb={5}
            >
                Profile Settings
            </Heading>

            {/* Unsaved changes alert */}
            {hasUnsavedChanges && (
                <Flex
                    align="flex-start"
                    gap={3}
                    p={4}
                    mb={6}
                    bg="#FFF8E7"
                    border="1px solid #F5D58A"
                    borderRadius="9px"
                >
                    <Box color="#B7791F" mt="2px">
                        <IoWarningOutline size={21} />
                    </Box>

                    <Box>
                        <Text
                            fontSize="14px"
                            fontWeight="600"
                            color="#854D0E"
                        >
                            You have unsaved changes
                        </Text>

                        <Text
                            fontSize="13px"
                            color="#854D0E"
                            mt={1}
                        >
                            Save or cancel your changes before leaving this page.
                        </Text>
                    </Box>
                </Flex>
            )}

            {/* Profile form card */}
            <Box
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="12px"
                overflow="hidden"
            >
                {/* Card heading */}
                <Box p={{ base: 4, md: 6 }}>
                    <Heading
                        fontSize="18px"
                        fontWeight="600"
                        color="#1E293B"
                    >
                        Your Profile
                    </Heading>

                    <Text
                        fontSize="14px"
                        color="#64748B"
                        mt={1}
                    >
                        Edit your personal information below.
                    </Text>
                </Box>

                {/* Form fields */}
                <Box p={{ base: 4, md: 6 }}>
                    <Grid
                        templateColumns={{
                            base: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                        gap={6}
                    >
                        {/* Name */}
                        {renderField(
                            "Name",
                            "name",
                            "Enter your full name",
                            "text",
                            false,
                            50
                        )}

                        {/* Email */}
                        {renderField(
                            "Email",
                            "email",
                            "Enter your email address",
                            "email",
                            true,
                            100
                        )}

                        {/* Phone */}
                        {renderField(
                            "Phone",
                            "phone",
                            "Enter your phone number",
                            "tel",
                            false,
                            10
                        )}

                        {/* Doctor name */}
                        {user?.role === "patient" &&
                            renderField(
                                "Doctor Name",
                                "doctor_name",
                                "Enter doctor name",
                                "text",
                                true,
                                50
                            )
                        }

                        {/* Address */}
                        <Box gridColumn={{ base: "auto", md: "1 / -1" }}>
                            <Text
                                mb={2}
                                fontSize="14px"
                                fontWeight="500"
                                color="#334155"
                            >
                                Address
                            </Text>

                            <Input
                                value={profile.address}
                                maxLength={250}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                                placeholder="Enter your address"
                                h="100px"
                                border="1px solid"
                                borderColor={
                                    errors.address ? "red.500" : "#CBD5E1"
                                }
                                borderRadius="7px"
                                fontSize="14px"
                                bg="white"
                                color="#1E293B"
                                _placeholder={{ color: "#94A3B8" }}
                                _focus={{
                                    borderColor: errors.address
                                        ? "red.500"
                                        : "#2160C4",
                                    boxShadow: errors.address
                                        ? "0 0 0 1px #E53E3E"
                                        : "0 0 0 1px #2160C4",
                                }}
                            />

                            {errors.address && (
                                <Text color="red.500" fontSize="xs" mt={1}>
                                    {errors.address}
                                </Text>
                            )}
                        </Box>
                    </Grid>
                </Box>

                {/* Bottom action buttons */}
                <Flex
                    justify="flex-end"
                    align="center"
                    gap={3}
                    p={{ base: 4, md: 6 }}
                    flexWrap="wrap"
                >
                    <Button
                        variant="outline"
                        borderColor="#CBD5E1"
                        color="#334155"
                        borderRadius="7px"
                        h="40px"
                        onClick={handleCancel}
                        disabled={!hasUnsavedChanges || loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        bg="#2160C4"
                        color="white"
                        borderRadius="7px"
                        h="40px"
                        px={5}
                        onClick={handleSave}
                        loading={loading}
                        disabled={!hasUnsavedChanges || loading}
                        _hover={{ bg: "#2160C4" }}
                    >
                        Save
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
};

export default ProfileSettings;
