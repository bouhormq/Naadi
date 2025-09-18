import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TeamMember } from '@naadi/types';
import { getTeamMembersByVenueId, getTeamMemberInitials } from '@naadi/assets/data/teamMembers';

export default function TeamListScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        if (id) {
            const members = getTeamMembersByVenueId(id);
            setTeamMembers(members);
        }
    }, [id]);

    const handleTeamMemberPress = (memberId: string) => {
        router.push(`/venue/${id}/team/${memberId}`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/venue/${id}`)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Select professional</Text>
            </View>
            
            <ScrollView style={styles.container}>
                <View style={styles.gridContainer}>
                    {/* Any team member option */}
                    <TouchableOpacity
                        style={styles.teamMemberCard}
                        onPress={() => handleTeamMemberPress('any')}
                    >
                        <View style={styles.anyMemberIcon}>
                            <Ionicons name="people-outline" size={32} color="#666" />
                        </View>
                        <Text style={styles.teamMemberName}>Any team member</Text>
                        <Text style={styles.teamMemberSubtitle}>Maximum availability</Text>
                    </TouchableOpacity>

                    {/* Team members */}
                    {teamMembers.map(member => (
                        <TouchableOpacity
                            key={member.id}
                            style={styles.teamMemberCard}
                            onPress={() => handleTeamMemberPress(member.id)}
                        >
                            <View style={styles.teamMemberAvatar}>
                                {member.image ? (
                                    <Image source={{ uri: member.image }} style={styles.teamMemberImage} />
                                ) : (
                                    <Text style={styles.teamMemberInitials}>
                                        {getTeamMemberInitials(member.name)}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.teamMemberName}>{member.name}</Text>
                            <Text style={styles.teamMemberRole}>{member.role}</Text>
                            {member.rating && (
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.ratingText}>{member.rating}</Text>
                                    <Ionicons name="star" size={12} color="#FFD700" style={styles.starIcon} />
                                </View>
                            )}
                        </TouchableOpacity>
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
        fontSize: 22,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 6,
    },
    teamMemberCard: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    anyMemberIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamMemberAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8E3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    teamMemberImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    teamMemberInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    teamMemberName: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    teamMemberRole: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    teamMemberSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
        marginRight: 4,
    },
    starIcon: {
        marginLeft: 0,
    },
});
