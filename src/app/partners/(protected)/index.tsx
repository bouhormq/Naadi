import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList
} from 'react-native';
import CustomText from '@/components/CustomText'; 
// Use the correct alias or relative path for API functions
import { getMyBusinesses, setMyBusinessProfile } from '../../../api/business'; 
// import { getMyBusinessProfile, setMyBusinessProfile } from '@naadi/api/business'; // Alternative alias
import { Business, PhoneInfo } from '../../../../types'; // Adjust path as needed
// import { Business } from '@naadi/types'; // Alternative alias
import { auth } from '../../../config/firebase'; // Import auth directly
import { onAuthStateChanged, User } from 'firebase/auth'; // Import onAuthStateChanged
import PhoneInput, { countriesData } from '../../../components/PhoneInput'; // Import PhoneInput component and countriesData

// Define the expected payload type for setMyBusinessProfile API call locally
// Based on the API function signature: Partial<Pick<Business, 'id'>> & Omit<Business, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>
type BusinessSavePayload = Partial<Pick<Business, 'id'>> & Omit<Business, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>;

// Helper function to get default phone state
const getDefaultPhoneInfo = (): PhoneInfo => {
    const defaultCountry = countriesData.find(c => c.code === 'MA') || countriesData[0];
    return {
        code: defaultCountry.code,
        name: defaultCountry.name,
        number: '', // Start with empty number
        dialCode: defaultCountry.dialCode,
    };
};

export default function PartnerProtectedIndex() {
    // State for the list of businesses
    const [businessList, setBusinessList] = useState<Business[]>([]);
    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null); // null = creating new, string = editing existing

    // Loading and error states
    const [isLoadingList, setIsLoadingList] = useState(true); // Loading the list
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true); 

    // Form state - Clear initial values, will be populated on selection
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    // Initialize phoneInfo state with a default structure, never null
    const [phoneInfo, setPhoneInfo] = useState<PhoneInfo>(getDefaultPhoneInfo());
    const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true); 

    // Function to populate form fields based on selected business
    const populateForm = (business: Business | null) => {
        if (business) {
            setName(business.name || '');
            setCategory(business.category || '');
            setDescription(business.description || '');
            setWebsite(business.website || '');
            // Ensure phone is set correctly, fallback to default if missing
            setPhoneInfo(business.phone || getDefaultPhoneInfo());
            setIsPhoneValid(!!business.phone?.number); 
        } else {
            // Clear form for new business, reset phone to default empty state
            setName('');
            setCategory('');
            setDescription('');
            setWebsite('');
            setPhoneInfo(getDefaultPhoneInfo()); // Reset to default, not null
            setIsPhoneValid(true); // Reset validation
        }
    };

    // Fetch business list data
    const fetchBusinesses = useCallback(async (user: User | null) => {
        if (!user) { 
            setError("Authentication error occurred.");
            setIsLoadingList(false);
            setCheckingAuth(false);
            return;
        }
        setIsLoadingList(true);
        setError(null);
        try {
            console.log(`Fetching business list for user: ${user.uid}`); 
            const list = await getMyBusinesses(); 
            setBusinessList(list);
            if (list.length > 0) {
                setSelectedBusinessId(list[0].id ?? null); // Use nullish coalescing
                populateForm(list[0]);
            } else {
                setSelectedBusinessId(null); 
                populateForm(null);
            }
            console.log(`Fetched ${list.length} businesses.`);
        } catch (err: any) {
            console.error("Error fetching business list:", err); 
            setError("Failed to load business list. " + err.message);
            Alert.alert("Error Loading Data", err.message || "Could not fetch businesses.");
        } finally {
            setIsLoadingList(false);
        }
    }, []);

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCheckingAuth(false); // Auth check is complete
            if (user) {
                console.log("Auth state confirmed: User logged in", user.uid);
                fetchBusinesses(user); // Fetch list when logged in
            } else {
                console.log("Auth state confirmed: User logged out");
                setIsLoadingList(false); // No data to load
                setError("User is not authenticated."); 
                setBusinessList([]); // Clear list if logged out
                setSelectedBusinessId(null); // Reset selection
                populateForm(null); // Clear form
            }
        });
        return () => unsubscribe();
    }, [fetchBusinesses]); // Depend on fetchBusinesses

    // Handle selecting a business from the list or creating new
    const handleSelectBusiness = (businessId: string | null) => {
        setSelectedBusinessId(businessId);
        if (businessId === null) {
            populateForm(null);
        } else {
            const selected = businessList.find(b => b.id === businessId);
            populateForm(selected || null); 
        }
    };

    // Phone input change handler
    const handlePhoneChange = (info: PhoneInfo | null) => {
        if (info) {
            // If info is provided (country changed or number typed), update state
        setPhoneInfo(info);
            setIsPhoneValid(!!info.number); // Validate based on the number presence
        } else {
            // If info is null (number cleared in PhoneInput), reset to default state
            setPhoneInfo(getDefaultPhoneInfo());
            setIsPhoneValid(true); // Empty number is considered valid until submission attempt
        }
    };

    // Handle saving the data (Create or Update)
    const handleSave = async () => {
        console.log("handleSave called"); 

        const user = auth.currentUser;
        if (!user) {
            console.log("handleSave exit: No user"); 
            Alert.alert("Authentication Error", "Cannot save profile. User is not authenticated.");
            return;
        }

        // Client-side validation
        let phoneCheckValid = true;
        // phoneInfo is never null, just check if number is empty
        if (!phoneInfo.number) { 
            phoneCheckValid = false;
            setIsPhoneValid(false); // Mark phone as invalid
        }
        // else {
            // Optional: Add more specific validation (length, format) here if needed
        //     setIsPhoneValid(true); 
        // }

        if (!name || !category || !phoneCheckValid) {
            console.log("handleSave exit: Missing required fields", { name, category, phoneInfo, phoneCheckValid }); 
            Alert.alert("Missing Information", "Business Name, Category, and a valid Phone Number are required.");
            return;
        }

        setIsSaving(true);
        setError(null);

        const businessData: Partial<Business> = {
            ...(selectedBusinessId && { id: selectedBusinessId }), 
            name,
            category,
            phone: phoneInfo, // phoneInfo is guaranteed to be a PhoneInfo object
            description: description || undefined, 
            website: website || undefined,
        };
        
        const payload = businessData as BusinessSavePayload; 
        console.log("handleSave: Constructing payload:", payload); 

        try {
            console.log(`handleSave: Calling setMyBusinessProfile (${selectedBusinessId ? 'Update' : 'Create'})...`); 
            const result = await setMyBusinessProfile(payload);
            console.log("handleSave: setMyBusinessProfile call successful", result); 

            Alert.alert("Success", result.message || "Business profile saved successfully!");
            await fetchBusinesses(user); 
           
            // If it was a creation, select the newly created business
            if (!selectedBusinessId && result.businessId) {
                // We need to wait for fetchBusinesses to update the list state before selecting.
                // A better approach might be to optimistically update the list state,
                // but for simplicity, we'll just rely on the refresh. The user might need to re-select.
                 console.log("New business created, list refreshed. ID:", result.businessId);
                 // Attempt to select the new business after refresh (might require slight delay or better state management)
                 // setSelectedBusinessId(result.businessId); // Re-selecting might not work immediately if fetch is async
            }
             // No need to manually populate form, fetchBusinesses handles selection/population after refresh

        } catch (err: any) {
             console.error("handleSave Error:", err); 
            setError("Failed to save business profile. " + err.message);
            Alert.alert("Error Saving", err.message || "Could not save business details.");
        } finally {
            console.log("handleSave: Setting isSaving to false"); 
            setIsSaving(false);
        }
    };

    // Render item for the FlatList
    const renderBusinessItem = ({ item }: { item: Business }) => (
        <TouchableOpacity 
            style={[
                styles.listItem, 
                item.id === selectedBusinessId && styles.listItemSelected
            ]} 
            onPress={() => handleSelectBusiness(item.id ?? null)}
        >
            <CustomText 
                style={[
                    styles.listItemText,
                    item.id === selectedBusinessId && styles.listItemTextSelected
                ]}
            >
                {item.name}
            </CustomText>
        </TouchableOpacity>
    );

    // Show loading indicator while checking auth state
    if (checkingAuth) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <CustomText>Checking authentication...</CustomText>
            </View>
        );
    }
    
    // Show error if authentication failed or user is not logged in
    if (error && error.includes("User is not authenticated")) {
        return (
            <View style={styles.centered}>
                <CustomText style={styles.errorText}>{error}</CustomText>
                 {/* Optionally add a Login button here */}
            </View>
        );
    }

    // Main component rendering
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
        >
            <View style={styles.listContainer}>
                <CustomText style={styles.listTitle}>Your Businesses</CustomText>
                {isLoadingList ? (
                    <ActivityIndicator style={{ marginTop: 10 }}/>
                ) : businessList.length === 0 ? (
                    <CustomText style={styles.noBusinessesText}>No businesses found. Create one below!</CustomText>
                ) : (
                    <FlatList
                        data={businessList}
                        renderItem={renderBusinessItem}
                        keyExtractor={(item) => item.id ?? `fallback-${Math.random()}`}
                        style={styles.flatList}
                        ListFooterComponent={( // Add "Create New" button at the end of the list
                             <TouchableOpacity 
                                style={[
                                    styles.listItem, 
                                    styles.createNewButton,
                                    selectedBusinessId === null && styles.listItemSelected // Highlight if "create new" is active
                                ]} 
                                onPress={() => handleSelectBusiness(null)} // null ID signifies create new
                            >
                                <CustomText 
                                    style={[
                                        styles.listItemText, 
                                        styles.createNewButtonText,
                                        selectedBusinessId === null && styles.listItemTextSelected
                                    ]}
                                >
                                    + Create New Business
                                </CustomText>
                            </TouchableOpacity>
                        )}
                    />
                )}
                 {error && !error.includes("User is not authenticated") && !error.includes("list") && (
                    <CustomText style={[styles.errorText, { marginTop: 10 }]}>{error}</CustomText>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <CustomText style={styles.title}>
                    {selectedBusinessId ? 'Edit Business Profile' : 'Create New Business'}
                </CustomText>
                
                {/* Error specifically related to saving */}
                 {error && error.includes("Failed to save") && (
                    <CustomText style={styles.errorText}>{error}</CustomText>
                )}

                {/* Form Fields - same as before but populated dynamically */}
                <CustomText style={styles.label}>Business Name *</CustomText>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your Business Name"
                    placeholderTextColor="#9ca3af"
                />

                <CustomText style={styles.label}>Category *</CustomText>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g., Yoga Studio, Gym, Wellness Center"
                    placeholderTextColor="#9ca3af"
                />

                <CustomText style={styles.label}>Phone Number *</CustomText>
                <PhoneInput
                    value={phoneInfo} // Now always passes PhoneInfo, never null
                    onChangeInfo={handlePhoneChange} 
                    isValid={isPhoneValid} 
                    containerStyle={{ marginBottom: isPhoneValid ? 20 : 5 }} 
                />
                {!isPhoneValid && <CustomText style={styles.validationErrorText}>Please enter a valid phone number.</CustomText>}


                <CustomText style={styles.label}>Description</CustomText>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Tell users about your business..."
                    placeholderTextColor="#9ca3af"
                    multiline
                />

                <CustomText style={styles.label}>Website</CustomText>
                <TextInput
                    style={styles.input}
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="https://yourbusiness.com"
                    placeholderTextColor="#9ca3af"
                    keyboardType="url"
                    autoCapitalize="none"
                />

                <TouchableOpacity 
                    style={[styles.button, isSaving && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={isSaving || isLoadingList} // Disable save if list is loading
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" size="small" /> 
                    ) : (
                        <CustomText style={styles.buttonText}>
                            {selectedBusinessId ? 'Update Profile' : 'Create Profile'}
                        </CustomText>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Light gray background
    },
    listContainer: { // Container for the business list
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // Light border separator
        maxHeight: '40%', // Limit list height
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#334155', // Darker text
    },
    flatList: {
        // Add styling if needed, e.g., borders
    },
    listItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9', // Very light separator for items
        borderRadius: 6,
        marginBottom: 5,
        backgroundColor: '#fff', // White background for items
    },
    listItemSelected: {
        backgroundColor: '#e0e7ff', // Light indigo background for selected
        borderColor: '#a5b4fc', // Indigo border for selected
        borderWidth: 1, // Add border to selected
        paddingHorizontal: 9, // Adjust padding due to border
    },
    listItemText: {
        fontSize: 16,
        color: '#475569', // Medium gray text
    },
    listItemTextSelected: {
        color: '#3730a3', // Indigo text for selected
        fontWeight: '600',
    },
    createNewButton: {
       backgroundColor: '#e0f2fe', // Light cyan background
       borderStyle: 'dashed',
       borderColor: '#7dd3fc', // Cyan border
       borderWidth: 1,
    },
    createNewButtonText: {
        color: '#075985', // Darker cyan text
        textAlign: 'center',
        fontWeight: '600',
    },
     noBusinessesText: {
        textAlign: 'center',
        color: '#64748b', // Gray text
        marginTop: 10,
        fontStyle: 'italic',
    },
    scrollContainer: { // Style for ScrollView's content (form part)
        padding: 20,
        paddingBottom: 50, // Extra padding at bottom
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22, // Slightly smaller title for form section
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        color: '#334155',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#475569',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
        color: '#334155',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top', 
    },
    button: {
        backgroundColor: '#2563eb', 
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8', 
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#dc2626', 
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '500',
    },
    validationErrorText: { 
        color: '#dc2626', 
        fontSize: 12,
        marginTop: -15, // Position below the input
        marginBottom: 15,
    }
}); 