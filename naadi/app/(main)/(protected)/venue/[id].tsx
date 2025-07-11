import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getVenueDetails, getVenueServices, getVenueReviews } from '@naadi/utils/api/venue';
import { EstablishmentData } from '@naadi/types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VenueDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [venue, setVenue] = useState<EstablishmentData | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                } catch (error) {
                    console.error("Failed to fetch venue data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!venue) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text>Venue not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="share-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="heart-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Image */}
                <Image source={{ uri: venue.images?.[0] }} style={styles.mainImage} />

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFC107" />
                        <Text style={styles.ratingText}>{venue.rating.toFixed(1)} ({venue.numberReviews} reviews)</Text>
                    </View>
                    <Text style={styles.addressText}>{venue.address}</Text>
                    <Text style={styles.hoursText}>Closed · Opens Wednesday at 10:00 AM</Text>
                </View>

                {/* Services Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    {services.map(service => (
                        <View key={service.id} style={styles.serviceItem}>
                            <View>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.serviceDetails}>{service.duration}</Text>
                                <Text style={styles.serviceDetails}>{service.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.bookButtonText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                
                 {/* Reviews Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    {reviews.map(review => (
                         <View key={review.id} style={styles.reviewItem}>
                            <Text style={styles.reviewAuthor}>{review.author}</Text>
                            <Text style={styles.reviewText}>{review.text}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.bookNowButton}>
                    <Text style={styles.bookNowButtonText}>Book now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
    headerIcon: { padding: 8 },
    mainImage: { width: '100%', height: 250, backgroundColor: '#f0f0f0' },
    infoContainer: { padding: 20 },
    venueName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    ratingText: { marginLeft: 8, fontSize: 16 },
    addressText: { fontSize: 16, color: '#555', marginBottom: 4 },
    hoursText: { fontSize: 16, color: '#555' },
    sectionContainer: { paddingHorizontal: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    serviceName: { fontSize: 16, fontWeight: '500' },
    serviceDetails: { fontSize: 14, color: '#666', marginTop: 2 },
    bookButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
    bookButtonText: { fontWeight: '500' },
    reviewItem: { marginBottom: 16 },
    reviewAuthor: { fontWeight: 'bold', marginBottom: 4 },
    reviewText: { color: '#333', lineHeight: 20 },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    bookNowButton: { backgroundColor: '#111', padding: 16, borderRadius: 8, alignItems: 'center' },
    bookNowButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
