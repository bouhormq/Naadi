import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
// Using relative paths carefully
import { PartnerAccount, PartnerSignupRequest } from '@naadi/types'; 
// Using relative paths carefully
import { 
    getAdminDashboardData, 
    approvePartnerRequest, 
    togglePartnerAccountStatus 
} from '@naadi/api';

// Define combined types for easier state management
// More explicit Timestamp structure handling
interface FirestoreTimestampObject { _seconds: number; _nanoseconds: number; }
interface FirestoreTimestampWithDate { toDate: () => Date; }
type PossibleTimestamp = FirestoreTimestampWithDate | FirestoreTimestampObject | Date | null | undefined;

type PendingRequest = PartnerSignupRequest & { 
    id: string; 
    createdAt?: PossibleTimestamp; 
};
type Account = PartnerAccount & { 
    id: string; 
    createdAt?: PossibleTimestamp;
    approvedAt?: PossibleTimestamp;
    registeredAt?: PossibleTimestamp;
    // uid is already optional
    registrationCode?: string; // Add registrationCode here explicitly
};
type ActiveView = 'pending' | 'approved'; // Type for view state

// Renaming component to reflect its purpose (optional)
export default function AdminDashboardScreen() {
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [partnerAccounts, setPartnerAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({}); // Loading state per item
    const [activeView, setActiveView] = useState<ActiveView>('pending'); // State for current view
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminDashboardData();
            setPendingRequests(data.pendingRequests || []);
            setPartnerAccounts(data.partnerAccounts || []);
        } catch (err: any) {
            setError(err.message || "Failed to load dashboard data.");
            Alert.alert("Error", err.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (requestId: string) => {
        setActionLoading(prev => ({ ...prev, [`approve-${requestId}`]: true }));
        try {
            const result = await approvePartnerRequest(requestId);
            Alert.alert("Success", result.message);
            // Refresh data after action
            await fetchData(); 
        } catch (err: any) {
            Alert.alert("Error Approving", err.message || "Failed to approve partner.");
        } finally {
             setActionLoading(prev => ({ ...prev, [`approve-${requestId}`]: false }));
        }
    };

    const handleToggleStatus = async (accountId: string) => {
        setActionLoading(prev => ({ ...prev, [`toggle-${accountId}`]: true }));
        try {
            const result = await togglePartnerAccountStatus(accountId);
            Alert.alert("Success", result.message);
             // Refresh data after action
            await fetchData();
        } catch (err: any) {
            Alert.alert("Error Toggling Status", err.message || "Failed to toggle status.");
        } finally {
             setActionLoading(prev => ({ ...prev, [`toggle-${accountId}`]: false }));
        }
    };

    // Helper function to format Firestore Timestamp (more robust)
    const formatTimestamp = (timestamp: PossibleTimestamp): string => {
        if (!timestamp) {
            return 'N/A';
        }
        try {
            // Check if it has toDate method (standard Timestamp)
            if (typeof (timestamp as FirestoreTimestampWithDate).toDate === 'function') {
                return (timestamp as FirestoreTimestampWithDate).toDate().toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });
            }
            // Check if it looks like a serialized Timestamp object
            if (typeof (timestamp as FirestoreTimestampObject)._seconds === 'number') {
                const date = new Date((timestamp as FirestoreTimestampObject)._seconds * 1000); 
                return date.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });
            }
             // Check if it's already a Date object (less likely from Firestore directly but possible)
            if (timestamp instanceof Date) {
                 return timestamp.toLocaleDateString('en-US', {
                     year: 'numeric', month: 'short', day: 'numeric'
                 });
            }
            // If none of the above, return 'Invalid Date'
            console.warn("Timestamp format not recognized:", timestamp);
            return 'Invalid Date';
        } catch (e) {
            console.error("Error formatting timestamp:", e, "Input:", timestamp);
            return 'Invalid Date';
        }
    };

    // Filter data based on search term (searches across more fields)
    const filteredPendingRequests = useMemo(() => {
        if (!searchTerm) return pendingRequests;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return pendingRequests.filter(req => {
            const searchableString = [
                req.firstName,
                req.lastName,
                req.businessName,
                req.email,
                `${req.phone?.dialCode || ''} ${req.phone?.number || ''}`,
                req.location,
                req.businessType,
                formatTimestamp(req.createdAt) // Search formatted date
            ].join(' ').toLowerCase(); // Combine fields into one string
            return searchableString.includes(lowerCaseSearchTerm);
        });
    }, [pendingRequests, searchTerm]);

    const filteredPartnerAccounts = useMemo(() => {
         if (!searchTerm) return partnerAccounts;
         const lowerCaseSearchTerm = searchTerm.toLowerCase();
         return partnerAccounts.filter(acc => {
             const searchableString = [
                 acc.firstName,
                 acc.lastName,
                 acc.businessName,
                 acc.email,
                 `${acc.phone?.dialCode || ''} ${acc.phone?.number || ''}`,
                 acc.location,
                 acc.status,
                 formatTimestamp(acc.approvedAt), // Search formatted date
                 acc.registrationCode,
                 formatTimestamp(acc.registeredAt) // Add registeredAt to search
             ].join(' ').toLowerCase(); // Combine fields into one string
             return searchableString.includes(lowerCaseSearchTerm);
         });
    }, [partnerAccounts, searchTerm]);

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.errorText}>Error: {error}</Text><Button title="Retry" onPress={fetchData}/></View>;
    }

    // --- Helper Render Functions for Table --- 

    const renderTableHeader = (columns: { label: string; style: object }[]) => (
        <View style={styles.tableHeader}>
            {columns.map((col, index) => (
                <Text key={index} style={[styles.tableHeaderText, styles.tableCell, col.style]}>{col.label}</Text>
            ))}
        </View>
    );

    const renderPendingRequestRow = (req: PendingRequest) => (
        <View key={req.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellName]}>{req.firstName} {req.lastName}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellBusiness]}>{req.businessName}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellEmail]}>{req.email}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{`${req.phone?.dialCode || ''} ${req.phone?.number || ''}`}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{req.location}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{req.businessType}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{formatTimestamp(req.createdAt)}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellRegCode]}>N/A</Text>
            <View style={[styles.tableCell, styles.actionCell]}> 
                {actionLoading[`approve-${req.id}`] ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <TouchableOpacity onPress={() => handleApprove(req.id)} style={styles.actionButtonApprove}>
                       <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderPartnerAccountRow = (acc: Account) => (
        <View key={acc.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellName]}>{acc.firstName} {acc.lastName}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellBusiness]}>{acc.businessName}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellEmail]}>{acc.email}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{`${acc.phone?.dialCode || ''} ${acc.phone?.number || ''}`}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{acc.location}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, acc.status === 'enabled' ? styles.enabled : styles.disabled]}>
                {acc.status}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{formatTimestamp(acc.approvedAt)}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellRegCode]}>{acc.registrationCode || 'N/A'}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, styles.cellSmall]}>{formatTimestamp(acc.registeredAt)}</Text>
            <View style={[styles.tableCell, styles.actionCell]}> 
                {actionLoading[`toggle-${acc.id}`] ? (
                    <ActivityIndicator size="small" />
                ) : (
                     <TouchableOpacity 
                        onPress={() => handleToggleStatus(acc.id)} 
                        style={acc.status === 'enabled' ? styles.actionButtonDisable : styles.actionButtonEnable}
                    >
                       <Text style={styles.actionButtonText}>{acc.status === 'enabled' ? 'Disable' : 'Enable'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    // --- Main Render --- 

    return (
        <View style={styles.container}> 
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search by Name, Business, or Email..."
                    placeholderTextColor="#9ca3af"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {/* Segmented Control */}
             <View style={styles.segmentControlContainer}>
                <TouchableOpacity 
                    style={[styles.segmentButton, activeView === 'pending' && styles.segmentButtonActive]}
                    onPress={() => setActiveView('pending')}
                >
                    <Text style={[styles.segmentButtonText, activeView === 'pending' && styles.segmentButtonTextActive]}>
                        Pending ({pendingRequests.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.segmentButton, activeView === 'approved' && styles.segmentButtonActive]}
                    onPress={() => setActiveView('approved')}
                >
                     <Text style={[styles.segmentButtonText, activeView === 'approved' && styles.segmentButtonTextActive]}>
                        Approved ({partnerAccounts.length})
                    </Text>
                </TouchableOpacity>
            </View>

             {/* Content Area - Use ScrollView for the table content */}
             <ScrollView style={styles.contentScrollView}>
                {activeView === 'pending' && (
                    <View style={styles.tableContainer}>
                            {renderTableHeader([
                                { label: 'Name', style: styles.cellName },
                                { label: 'Business', style: styles.cellBusiness },
                                { label: 'Email', style: styles.cellEmail },
                                { label: 'Phone', style: styles.cellSmall },
                                { label: 'Location', style: styles.cellSmall },
                                { label: 'Type', style: styles.cellSmall },
                                { label: 'Requested', style: styles.cellSmall },
                                { label: 'Reg Code', style: styles.cellRegCode },
                                { label: 'Action', style: styles.actionCell }
                            ])}
                        {filteredPendingRequests.length === 0 ? (
                            <Text style={styles.emptyText}>{searchTerm ? 'No matching requests found.' : 'No pending requests.'}</Text>
                        ) : (
                            filteredPendingRequests.map(renderPendingRequestRow)
                        )}
                    </View>
                )}

                {activeView === 'approved' && (
                     <View style={styles.tableContainer}>
                         {renderTableHeader([
                              { label: 'Name', style: styles.cellName },
                              { label: 'Business', style: styles.cellBusiness },
                              { label: 'Email', style: styles.cellEmail },
                              { label: 'Phone', style: styles.cellSmall },
                              { label: 'Location', style: styles.cellSmall },
                              { label: 'Status', style: styles.tableCell }, // Default flex for status
                              { label: 'Approved', style: styles.cellSmall },
                              { label: 'Reg Code', style: styles.cellRegCode },
                              { label: 'Registered', style: styles.cellSmall },
                              { label: 'Action', style: styles.actionCell }
                          ])}
                        {filteredPartnerAccounts.length === 0 ? (
                            <Text style={styles.emptyText}>{searchTerm ? 'No matching accounts found.' : 'No partner accounts found.'}</Text>
                        ) : (
                            filteredPartnerAccounts.map(renderPartnerAccountRow)
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// Updated Styles for shadcn/ui feel
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Lighter background (Tailwind slate-50)
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // --- Segmented Control Styles ---
    segmentControlContainer: {
        flexDirection: 'row',
        backgroundColor: '#e2e8f0', // Tailwind slate-200
        borderRadius: 8,
        margin: 15,
        overflow: 'hidden',
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentButtonActive: {
        backgroundColor: '#ffffff', // White background for active
        borderRadius: 6, // Slightly smaller radius to fit inside
        margin: 2, // Creates the border effect
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    segmentButtonText: {
        fontSize: 14,
        color: '#64748b', // Tailwind slate-500
        fontWeight: '500',
    },
    segmentButtonTextActive: {
        color: '#0f172a', // Tailwind slate-900
        fontWeight: '600',
    },
    // --- Content ScrollView ---
    contentScrollView: {
        flex: 1,
    },
    // --- Table Styles ---
    tableContainer: {
        marginHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#ffffff', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0', // Tailwind slate-200
        overflow: 'hidden', // Clip content to border radius
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc', // Tailwind slate-50 (very light gray)
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // Tailwind slate-200
        paddingHorizontal: 10, 
        paddingVertical: 12,
    },
    tableHeaderText: {
        fontSize: 12,
        color: '#64748b', // Tailwind slate-500
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9', // Tailwind slate-100 (lighter border for rows)
        paddingHorizontal: 10,
        paddingVertical: 12,
        alignItems: 'center', // Vertically align items in the row
    },
    tableCell: {
        flex: 1, // Distribute space equally by default
        paddingRight: 10, // Add some spacing between cells
    },
    // Adjust column widths for Pending Requests view
    cellName: { flex: 1.5 },
    cellBusiness: { flex: 1.5 },
    cellEmail: { flex: 2 },
    cellSmall: { flex: 1 }, // For shorter fields like Phone, Location, Type, Date
    cellRegCode: { flex: 1 }, // Added style for Reg Code column
    tableCellText: {
        fontSize: 14,
        color: '#334155', // Tailwind slate-700
    },
     actionCell: {
        flex: 0.8, // Slightly more space for button
        alignItems: 'center', // Center the button/indicator
        paddingRight: 0,
    },
    actionButtonApprove: {
        backgroundColor: '#2563eb', // Tailwind blue-600
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
     actionButtonEnable: {
        backgroundColor: '#16a34a', // Tailwind green-600
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
     actionButtonDisable: {
        backgroundColor: '#dc2626', // Tailwind red-600
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
    },
    // --- Status/Error/Empty Text Styles ---
    enabled: {
        color: 'green',
        fontWeight: 'bold'
    },
    disabled: {
        color: 'red',
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#6c757d',
        textAlign: 'center',
        paddingVertical: 20, // Add padding when empty
    },
    // --- Search Input Styles ---
    searchContainer: {
        paddingHorizontal: 15,
        paddingTop: 15, // Add some top padding
        paddingBottom: 5, // Space before segmented control
    },
    searchInput: {
        height: 40,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0', // Tailwind slate-200
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#334155',
    },
}); 