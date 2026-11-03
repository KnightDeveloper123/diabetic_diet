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
    // id: string;
    name: string;
    email: string;
    phone: string;
    doctor_id: string;
    address: string;
    doctor_name: string
}




const ProfileSettings = () => {

    const { loading, request } = useFetch();
    const { user,setUser } = useAuth()

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

    const hasUnsavedChanges =
        JSON.stringify(profile) !== JSON.stringify(savedProfile);

    const handleChange = (
        field: keyof ProfileForm,
        value: string
    ) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCancel = () => {
        setProfile(savedProfile);
    };

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
    }, [user]);

    const handleSave = async () => {
        try {
            const response = await request({
                url: "/api/health/edit-profile",
                method: "PUT",
                body: { ...profile, id: user?.id ?? "" },
                withLoader: true,
            });

            // Update the saved profile only after a successful API response.
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
                // alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const renderField = (
        label: string,
        field: keyof ProfileForm,
        placeholder: string,
        type = "text",
        disabled = false
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
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                h="44px"
                border="1px solid #CBD5E1"
                borderRadius="7px"
                fontSize="14px"
                bg={disabled ? "#F1F5F9" : "white"}
                color="#1E293B"
                _placeholder={{ color: "#94A3B8" }}
                _focus={{
                    borderColor: "#2160C4",
                    boxShadow: "0 0 0 1px #2160C4",
                }}
            />
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

                {/* <Box borderTop="1px solid #E2E8F0" /> */}

                {/* Form fields */}
                <Box p={{ base: 4, md: 6 }}>
                    <Grid
                        templateColumns={{
                            base: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                        gap={6}
                    >
                        {renderField(
                            "Name",
                            "name",
                            "Enter your full name"
                        )}

                        {renderField(
                            "Email",
                            "email",
                            "Enter your email address",
                            "email",
                            true
                        )}

                        {renderField(
                            "Phone",
                            "phone",
                            "Enter your phone number",
                            "tel"
                        )}

                        {renderField(
                            "Doctor Name",
                            "doctor_name",
                            "Enter doctor name",
                            "text",
                            true
                        )}

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
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                                placeholder="Enter your address"
                                // h="100px"
                                border="1px solid #CBD5E1"
                                borderRadius="7px"
                                fontSize="14px"
                                bg="white"
                                color="#1E293B"
                                _placeholder={{ color: "#94A3B8" }}
                                _focus={{
                                    borderColor: "#2160C4",
                                    boxShadow: "0 0 0 1px #2160C4",
                                }}
                            />
                        </Box>
                    </Grid>
                </Box>

                {/* Bottom action buttons */}
                <Flex
                    justify="flex-end"
                    align="center"
                    gap={3}
                    p={{ base: 4, md: 6 }}
                    // borderTop="1px solid #E2E8F0"
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