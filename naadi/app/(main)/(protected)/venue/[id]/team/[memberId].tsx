import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TeamMember, Service } from '@naadi/types';
import { getTeamMemberById, getTeamMemberInitials, getTeamMemberActivities } from '@naadi/assets/data/teamMembers';

export default function TeamMemberDetailScreen() {
    const { id: venueId, memberId } = useLocalSearchParams<{ id: string; memberId: string }>();
    const router = useRouter();
    const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
    const [activities, setActivities] = useState<Service[]>([]);

    useEffect(() => {
        if (memberId) {
            const member = getTeamMemberById(memberId);
            setTeamMember(member || null);
            
            if (member) {
                const memberActivities = getTeamMemberActivities(memberId);
                setActivities(memberActivities);
            }
        }
    }, [memberId]);

    if (!teamMember) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push(`/venue/${venueId}`)} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text>Team member not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/venue/${venueId}`)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Select services</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* Professional Info Section */}
                <TouchableOpacity style={styles.professionalInfo}>
                    <View style={styles.professionalAvatar}>
                        {teamMember.image ? (
                            <Image source={{ uri: teamMember.image }} style={styles.professionalImage} />
                        ) : (
                            <Text style={styles.professionalInitials}>
                                {getTeamMemberInitials(teamMember.name)}
                            </Text>
                        )}
                    </View>
                    <View style={styles.professionalDetails}>
                        <Text style={styles.professionalName}>{teamMember.name}</Text>
                        <Text style={styles.professionalRole}>{teamMember.role}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Category Tabs */}
                <View style={styles.categoryTabs}>
                    <TouchableOpacity style={styles.activeTab}>
                        <Text style={styles.activeTabText}>Featured</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>Nails</Text>
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Featured</Text>
                    
                    {activities.slice(0, 2).map(activity => (
                        <View key={activity.id} style={styles.serviceItem}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{activity.name.replace(` with ${teamMember.name}`, '')}</Text>
                                <Text style={styles.serviceDuration}>{activity.duration}</Text>
                                <Text style={styles.serviceDescription}>{activity.description}</Text>
                                <Text style={styles.servicePrice}>{activity.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Nails Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Nails</Text>
                    
                    {activities.map(activity => (
                        <View key={activity.id} style={styles.serviceItem}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{activity.name.replace(` with ${teamMember.name}`, '')}</Text>
                                <Text style={styles.serviceDuration}>{activity.duration}</Text>
                                <Text style={styles.serviceDescription}>{activity.description}</Text>
                                <Text style={styles.servicePrice}>{activity.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.addButton}>
                                <Ionicons name="add" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    closeButton: {
        padding: 8,
    },
    titleContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingRight: 60,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    professionalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    professionalAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    professionalImage: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    professionalInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    professionalDetails: {
        flex: 1,
    },
    professionalName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    professionalRole: {
        fontSize: 14,
        color: '#666',
    },
    categoryTabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    activeTab: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    inactiveTab: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    activeTabText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    inactiveTabText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    servicesSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    serviceDuration: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    serviceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
