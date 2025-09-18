import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getVenueReviews, getTeamMemberById } from '@naadi/assets/data/teamMembers';
import { Review } from '@naadi/types';

type SortOption = 'Latest' | 'Best' | 'Worst';

export default function VenueReviewsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('Latest');
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            const venueReviews = getVenueReviews(id);
            setReviews(venueReviews);
            setFilteredReviews(venueReviews);
        }
    }, [id]);

    useEffect(() => {
        let filtered = [...reviews];
        
        // Filter by rating if selected
        if (selectedRating !== null) {
            filtered = filtered.filter(review => review.rating === selectedRating);
        }
        
        // Sort reviews
        switch (sortBy) {
            case 'Latest':
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case 'Best':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'Worst':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
        }
        
        setFilteredReviews(filtered);
    }, [reviews, sortBy, selectedRating]);

    const handleRatingFilter = (rating: number) => {
        setSelectedRating(selectedRating === rating ? null : rating);
    };

    const handleSortSelect = (option: SortOption) => {
        setSortBy(option);
        setSortModalVisible(false);
    };

    const getAverageRating = (): number => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Number((sum / reviews.length).toFixed(1));
    };

    const getRatingCount = (rating: number) => {
        return reviews.filter(review => review.rating === rating).length;
    };

    const getTeamMemberName = (teamMemberId: string) => {
        const member = getTeamMemberById(teamMemberId);
        return member ? member.name : 'Unknown';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays <= 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
    };

    const renderReviewItem = ({ item }: { item: Review }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.userAvatar}>
                    <Text style={styles.userInitials}>{item.userInitials}</Text>
                </View>
                <View style={styles.reviewInfo}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.reviewDate}>{formatDate(item.date)}</Text>
                </View>
            </View>
            
            <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                    <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color={i < item.rating ? "#FFD700" : "#E0E0E0"}
                    />
                ))}
            </View>
            
            <Text style={styles.reviewComment}>{item.comment}</Text>
            
            <Text style={styles.teamMemberService}>
                Appointment with {getTeamMemberName(item.teamMemberId || '')}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header for Close Button */}
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Title below the close button */}
            <Text style={styles.headerTitle}>Reviews</Text>


            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
                <View style={styles.overallRating}>
                    {[...Array(5)].map((_, i) => (
                        <Ionicons
                            key={i}
                            name="star"
                            size={32}
                            color="#000"
                        />
                    ))}
                </View>
                <Text style={styles.averageRating}>{getAverageRating()} • {reviews.length} reviews</Text>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Filter by</Text>
                {[5, 4, 3, 2, 1].map(rating => (
                    <TouchableOpacity
                        key={rating}
                        style={[
                            styles.ratingFilter,
                            selectedRating === rating && styles.selectedRatingFilter
                        ]}
                        onPress={() => handleRatingFilter(rating)}
                    >
                        <View style={styles.filterCheckbox}>
                            {selectedRating === rating && (
                                <Ionicons name="checkmark" size={16} color="#007AFF" />
                            )}
                        </View>
                        <Text style={styles.ratingNumber}>{rating}</Text>
                        <View style={styles.ratingBar}>
                            <View 
                                style={[
                                    styles.ratingBarFill,
                                    { width: `${(getRatingCount(rating) / reviews.length) * 100}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.ratingCount}>{getRatingCount(rating)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sort Section */}
            <View style={styles.sortSection}>
                <Text style={styles.reviewCount}>{filteredReviews.length} reviews</Text>
                <View style={styles.sortOptionsGroup}>
                    <Text style={styles.sortButtonText}>Sort by:</Text>
                    <TouchableOpacity 
                        style={styles.sortButton}
                        onPress={() => setSortModalVisible(true)}
                    >
                        <Text style={styles.sortButtonValue}>{sortBy}</Text>
                        <Ionicons name="chevron-down" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reviews List */}
            <FlatList
                data={filteredReviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id}
                style={styles.reviewsList}
                showsVerticalScrollIndicator={false}
            />

            {/* Sort Modal */}
            <Modal
                visible={sortModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.sortModal}>
                        <View style={styles.sortModalHeader}>
                            <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        {(['Latest', 'Best', 'Worst'] as SortOption[]).map(option => (
                            <TouchableOpacity
                                key={option}
                                style={styles.sortOption}
                                onPress={() => handleSortSelect(option)}
                            >
                                <Text style={styles.sortOptionText}>{option}</Text>
                                {sortBy === option && (
                                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // New container for the close button to push it to the top-right
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Aligns children (the close button) to the right
        paddingHorizontal: 16,
        paddingTop: 16, // Spacing from the top of SafeAreaView
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        // This is now the main title below the close button
        paddingHorizontal: 16,
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        paddingBottom: 8, // Add some padding below the title
    },
    ratingSummary: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: '#fff',
    },
    overallRating: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    averageRating: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    filterSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    ratingFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    selectedRatingFilter: {
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
    },
    filterCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    ratingNumber: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginRight: 12,
        width: 12,
    },
    ratingBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        marginRight: 12,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#333',
        borderRadius: 2,
    },
    ratingCount: {
        fontSize: 16,
        color: '#666',
        minWidth: 20,
        textAlign: 'right',
    },
    sortSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    reviewCount: {
        fontSize: 16,
        color: '#666',
    },
    sortOptionsGroup: { // New style for the group
        flexDirection: 'row', // Arrange children horizontally
        alignItems: 'center',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginLeft: 8, // Add some margin to separate from "Sort by:" text
    },
    sortButtonText: {
        fontSize: 14,
        color: '#666',
    },
    sortButtonValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        marginRight: 4,
    },
    reviewsList: {
        flex: 1,
        backgroundColor: '#fff',
    },
    reviewItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e3f2fd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    userInitials: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1976d2',
    },
    reviewInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 14,
        color: '#666',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    reviewComment: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 8,
    },
    teamMemberService: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sortModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
        minHeight: 200,
    },
    sortModalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    sortOptionText: {
        fontSize: 16,
        color: '#000',
    },
});
