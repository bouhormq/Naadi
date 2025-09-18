import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getVenueDetails, getVenueServices, getVenueReviews } from '@naadi/utils/api/venue';
import { EstablishmentData, Service, TeamMember, Review } from '@naadi/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTeamMembersByVenueId, getTeamMemberInitials, getVenueReviews as getVenueReviewsFromTeam } from '@naadi/assets/data/teamMembers';
import { venues } from '@naadi/assets/data/venues';
import MapViewComponent from '../(components)/(search)/MapViewComponent';

const { width: screenWidth } = Dimensions.get('window');

export default function VenueDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [venue, setVenue] = useState<EstablishmentData | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [teamReviews, setTeamReviews] = useState<Review[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    // Map refs and state
    const mapRef = useRef<any>(null);
    const animatedY = useRef({ setValue: (value: number) => {} }).current;

    const getAverageRating = (): number => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Number((sum / reviews.length).toFixed(1));
    };

    // Add function to get nearby venues
    const getNearbyVenues = () => {
        return venues.filter(v => v.id !== id).slice(0, 2);
    };

    const nearbyVenues = getNearbyVenues();

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [venueData, servicesData, reviewsData] = await Promise.all([
                        getVenueDetails(id),
                        getVenueServices(id),
                        getVenueReviews(id),
                    ]);
                    setVenue(venueData);
                    setServices(servicesData);
                    setReviews(reviewsData);
                    
                    // Debug log
                    console.log('Venue data:', venueData);
                    console.log('Opening hours:', venueData?.openingHours);
                    
                    // Load team members for this venue
                    const venueTeamMembers = getTeamMembersByVenueId(id);
                    setTeamMembers(venueTeamMembers);
                    
                    // Load team reviews
                    const venueTeamReviews = getVenueReviewsFromTeam(id);
                    setTeamReviews(venueTeamReviews);
                    
                    if (servicesData.length > 0) {
                        const categories = [...new Set(servicesData.map(s => s.category))];
                        setSelectedCategory(categories[0] || null);
                    }
                } catch (error) {
                    console.error("Failed to fetch venue data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(category);
    };

    const handleImagePress = (index: number) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    const handleScroll = (event: any) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / screenWidth);
        setSelectedImageIndex(index);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleCardPress = (venue: any, height: number) => {
        // Handle venue card press if needed
    };

    const handleGetDirections = () => {
        if (venue?.coordinate) {
            const { latitude, longitude } = venue.coordinate;
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    if (!venue) {
        return <Text>Venue not found.</Text>;
    }

    const serviceCategories = [...new Set(services.map(s => s.category))];
    const filteredServices = services.filter(s => s.category === selectedCategory);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.imageGallery}>
                    <TouchableOpacity onPress={() => handleImagePress(0)} style={{ width: '100%', height: '100%' }}>
                        {venue.images && venue.images.length > 0 ? (
                            <Image source={{ uri: venue.images[0] }} style={styles.headerImage} />
                            ) : (
                            <View style={[styles.headerImage, { backgroundColor: '#f0f0f0' }]} />
                        )}
                    </TouchableOpacity>
                    <View style={styles.headerIconsContainer}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="share-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="heart-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {venue.images && venue.images.length > 1 && (
                        <View style={styles.imageCounterContainer}>
                            <Text style={styles.imageCounterText}>1/{venue.images.length}</Text>
                        </View>
                    )}
                </View>

                {/* Main Info */}
                <View style={styles.venueInfoContainer}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueLocation}>{venue.address}</Text>
                    <TouchableOpacity onPress={() => router.push(`/venue/${id}/reviews`)}>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{venue.rating} ({venue.numberReviews} reviews)</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Navigation Tabs */}
                <View style={styles.navTabs}>
                    {['Services', 'Team', 'Reviews', 'About'].map(tab => (
                        <TouchableOpacity key={tab} style={[styles.navTab, tab === 'Services' && styles.activeTab]}>
                            <Text style={[styles.navTabText, tab === 'Services' && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Services Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                        {serviceCategories.map(category => (
                            <TouchableOpacity
                                key={category}
                                style={[styles.categoryButton, selectedCategory === category && styles.activeCategoryButton]}
                                onPress={() => handleCategoryPress(category)}
                            >
                                <Text style={[styles.categoryButtonText, selectedCategory === category && styles.activeCategoryButtonText]}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {filteredServices.map(service => (
                        <View key={service.id} style={styles.serviceItem}>
                            <View>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.serviceDuration}>{service.duration}</Text>
                                <Text style={styles.servicePrice}>{service.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.bookButtonText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Team Section */}
                {teamMembers.length > 0 && (
                    <View style={styles.teamSection}>
                        <View style={styles.teamHeader}>
                            <Text style={styles.sectionTitle}>Team</Text>
                            <TouchableOpacity onPress={() => router.push(`/venue/${id}/team`)}>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScrollView}>
                            {teamMembers.slice(0, 3).map(member => (
                                <TouchableOpacity 
                                    key={member.id} 
                                    style={styles.teamMemberCard}
                                    onPress={() => router.push(`/venue/${id}/team/${member.id}`)}
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
                                        <View style={styles.teamMemberRating}>
                                            <Ionicons name="star" size={12} color="#FFD700" />
                                            <Text style={styles.teamMemberRatingText}>{member.rating}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Reviews Section */}
                {teamReviews.length > 0 && (
                    <View style={styles.reviewsSection}>
                        <TouchableOpacity 
                            style={styles.reviewsHeader}
                            onPress={() => router.push(`/venue/${id}/reviews`)}
                        >
                            <Text style={styles.sectionTitle}>Reviews</Text>
                        </TouchableOpacity>
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
                                        <Text style={styles.averageRating}>{getAverageRating()} ({teamReviews.length})</Text>
                                    </View>
                        
                        {/* Top Rated Review */}
                        {teamReviews.length > 0 && (() => {
                            const topRatedReview = teamReviews.reduce((prev, current) => 
                                (prev.rating > current.rating) ? prev : current
                            );
                            
                            return (
                                <View style={styles.topReviewContainer}>
                                    <View style={styles.topReviewHeader}>
                                        <View style={styles.topReviewUserAvatar}>
                                            <Text style={styles.topReviewUserInitials}>
                                                {topRatedReview.userName?.charAt(0).toUpperCase() || 'U'}
                                            </Text>
                                        </View>
                                        <View style={styles.topReviewUserInfo}>
                                            <Text style={styles.topReviewUserName}>{topRatedReview.userName || 'Anonymous'}</Text>
                                            <Text style={styles.topReviewDate}>{topRatedReview.date}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.topReviewRatingContainer}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name="star"
                                                size={20}
                                                color={i < topRatedReview.rating ? "#000" : "#E5E5E5"}
                                            />
                                        ))}
                                    </View>
                                    <Text style={styles.topReviewComment}>{topRatedReview.comment}</Text>
                                </View>
                            );
                        })()}
                    </View>
                )}

                {/* About Section */}
                <View style={styles.aboutSection}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.aboutDescription}>
                        {venue.about || `Welcome to ${venue.name}, your premier destination for ${venue.type.toLowerCase()} services. We are committed to providing exceptional service and ensuring every client feels valued and satisfied.`}
                    </Text>
                </View>

                {/* Opening Times Section */}
                <View style={styles.openingTimesSection}>
                    <Text style={styles.sectionTitle}>Opening times</Text>
                    {venue.openingHours ? (
                        Object.entries(venue.openingHours).map(([day, hours]) => (
                            <View key={day} style={styles.openingTimeRow}>
                                <View style={styles.dayIndicator}>
                                    <View style={[styles.dayDot, { backgroundColor: hours === 'Closed' ? '#ccc' : '#4CAF50' }]} />
                                    <Text style={[styles.dayText, { color: hours === 'Closed' ? '#ccc' : '#000' }]}>
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </Text>
                                </View>
                                <Text style={[styles.hoursText, { color: hours === 'Closed' ? '#ccc' : '#000' }]}>
                                    {hours}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.aboutDescription}>Opening hours not available</Text>
                    )}
                </View>

                {/* Additional Information Section */}
                <View style={styles.additionalInfoSection}>
                    <Text style={styles.sectionTitle}>Additional information</Text>
                    
                    {/* Map */}
                    <View style={styles.mapContainer}>
                        <View style={styles.mapWrapper}>
                            {venue.coordinate && (
                                <MapViewComponent
                                    mapRef={mapRef}
                                    filteredVenues={[venue]}
                                    animatedY={animatedY}
                                    handleCardPress={handleCardPress}
                                    region={{
                                        latitude: venue.coordinate.latitude,
                                        longitude: venue.coordinate.longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    singleVenueMode={true}
                                    scrollEnabled={false}
                                    zoomEnabled={true}
                                />
                            )}
                        </View>
                        <Text style={styles.mapAddress}>{venue.address}</Text>
                        <TouchableOpacity onPress={handleGetDirections}>
                            <Text style={styles.getDirectionsLink}>Get directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Venues Nearby Section */}
                <View style={styles.venuesNearbySection}>
                    <Text style={styles.sectionTitle}>Venues nearby</Text>
                    <View style={styles.nearbyVenuesContainer}>
                        {nearbyVenues.map((nearbyVenue) => (
                            <View key={nearbyVenue.id} style={styles.nearbyVenueCard}>
                                <View style={styles.nearbyVenueImage}>
                                    {nearbyVenue.images && nearbyVenue.images.length > 0 ? (
                                        <Image source={{ uri: nearbyVenue.images[0] }} style={styles.nearbyVenueImageStyle} />
                                    ) : (
                                        <View style={styles.nearbyVenueImagePlaceholder} />
                                    )}
                                </View>
                                <View style={styles.nearbyVenueInfo}>
                                    <Text style={styles.nearbyVenueName}>{nearbyVenue.name}</Text>
                                    <View style={styles.nearbyVenueRating}>
                                        {nearbyVenue.rating > 0 ? (
                                            <>
                                                <Ionicons name="star" size={14} color="#FFD700" />
                                                <Text style={styles.nearbyVenueRatingText}>
                                                    {nearbyVenue.rating.toFixed(1)} ({nearbyVenue.numberReviews})
                                                </Text>
                                            </>
                                        ) : (
                                            <Text style={styles.nearbyVenueNoRating}>No rating yet</Text>
                                        )}
                                    </View>
                                    <Text style={styles.nearbyVenueLocation}>{nearbyVenue.location}</Text>
                                    <View style={styles.nearbyVenueType}>
                                        <Text style={styles.nearbyVenueTypeText}>{nearbyVenue.type}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bookingFooter}>
                <Text style={styles.footerText}>{services.length} services available</Text>
                <TouchableOpacity style={styles.bookNowButton}>
                    <Text style={styles.bookNowButtonText}>Book now</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <FlatList
                        data={venue.images}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.fullScreenImage} resizeMode="contain" />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        initialScrollIndex={selectedImageIndex}
                        getItemLayout={(data, index) => (
                            { length: screenWidth, offset: screenWidth * index, index }
                        )}
                    />
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>{selectedImageIndex + 1} / {venue?.images?.length || 0}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    ratingSummary: {
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginBottom: 20,
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
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    headerIconsContainer: {
        position: 'absolute',
        top: 40, // Changed for safe area
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    iconButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
        marginHorizontal: 5,
    },
    imageGallery: {
        height: 250,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    venueInfoContainer: {
        padding: 16,
    },
    venueName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    venueLocation: {
        fontSize: 16,
        color: 'gray',
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 16,
    },
    navTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navTab: {
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    navTabText: {
        fontSize: 16,
        color: 'gray',
    },
    activeTabText: {
        color: 'black',
        fontWeight: 'bold',
    },
    servicesSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    categoryScrollView: {
        marginBottom: 16,
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    activeCategoryButton: {
        backgroundColor: 'black',
    },
    categoryButtonText: {
        fontSize: 16,
        color: 'black',
    },
    activeCategoryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '500',
    },
    serviceDuration: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    bookButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    footerText: {
        fontSize: 16,
    },
    bookNowButton: {
        backgroundColor: 'black',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    bookNowButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50, // Adjusted for safe area
        right: 20,
        zIndex: 1,
    },
    fullScreenImage: {
        width: screenWidth,
        height: '100%',
    },
    counterContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    counterText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageCounterContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    imageCounterText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    teamSection: {
        padding: 16,
    },
    teamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllText: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 16,
        fontWeight: '500',
    },
    teamScrollView: {
        marginHorizontal: -8,
    },
    teamMemberCard: {
        alignItems: 'center',
        marginHorizontal: 13,
        width: 80,
    },
    teamMemberAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        overflow: 'hidden',
    },
    teamMemberImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    teamMemberInitials: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#666',
    },
    teamMemberName: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 2,
    },
    teamMemberRole: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 4,
    },
    teamMemberRating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamMemberRatingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 2,
    },
    reviewsSection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewsCount: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    reviewsScrollView: {
        marginHorizontal: -8,
    },
    reviewCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 8,
        width: 280,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewUserAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewUserInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
    },
    reviewUserInfo: {
        flex: 1,
    },
    reviewUserName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    reviewRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewComment: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
        marginBottom: 12,
    },
    reviewDate: {
        fontSize: 12,
        color: '#868e96',
        fontWeight: '500',
    },
    topReviewContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    topReviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    topReviewUserAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E8E3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topReviewUserInitials: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6B46C1',
    },
    topReviewUserInfo: {
        flex: 1,
    },
    topReviewUserName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    topReviewRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    topReviewComment: {
        fontSize: 16,
        color: '#000',
        lineHeight: 22,
        marginBottom: 8,
    },
    topReviewDate: {
        fontSize: 14,
        color: '#999',
        fontWeight: '400',
    },
    // About Section Styles
    aboutSection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    aboutDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
    // Opening Times Section Styles
    openingTimesSection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    openingTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    dayIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '500',
    },
    hoursText: {
        fontSize: 16,
        fontWeight: '500',
    },
    // Additional Info Section Styles
    additionalInfoSection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    mapContainer: {
        marginTop: 20,
    },
    mapWrapper: {
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    mapAddress: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    getDirectionsLink: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    // Venues Nearby Section Styles
    venuesNearbySection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    nearbyVenuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nearbyVenueCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
    },
    nearbyVenueImage: {
        height: 120,
        backgroundColor: '#f0f0f0',
    },
    nearbyVenueImageStyle: {
        width: '100%',
        height: '100%',
    },
    nearbyVenueImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    nearbyVenueInfo: {
        padding: 12,
    },
    nearbyVenueName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    nearbyVenueRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nearbyVenueRatingText: {
        fontSize: 14,
        marginLeft: 4,
        color: '#333',
    },
    nearbyVenueNoRating: {
        fontSize: 14,
        color: '#999',
    },
    nearbyVenueLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    nearbyVenueType: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
    },
    nearbyVenueTypeText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
});
