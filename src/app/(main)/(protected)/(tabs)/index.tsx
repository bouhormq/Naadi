import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Image, useWindowDimensions } from 'react-native';
import { useSession } from '../../../../ctx';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCachedHomepageData } from '../../../../hooks/useCachedHomepageData';
import Footer from '../../../partners/(components)/Footer';

export default function MainProtectedIndex() {
  const { width } = useWindowDimensions();
  const { session, signOut } = useSession();
  const router = useRouter();
  const { recommendedData, newToNaadiData, trendingData, loading } = useCachedHomepageData();

  const recommendedRef = useRef<FlatList<any>>(null);
  const newToNaadiRef = useRef<FlatList<any>>(null);
  const trendingRef = useRef<FlatList<any>>(null);

  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [newToNaadiIndex, setNewToNaadiIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);

  const [isRecommendedEnd, setIsRecommendedEnd] = useState(false);
  const [isNewToNaadiEnd, setIsNewToNaadiEnd] = useState(false);
  const [isTrendingEnd, setIsTrendingEnd] = useState(false);

  const styles = useMemo(() => {
    const breakpointRow = 1200;
    const breakpointColumn = 800;
    const canFitAllInRow = Platform.OS === 'web' && width > breakpointRow;
    const canFitTwoInRow = Platform.OS === 'web' && width > breakpointColumn;

    return StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: '#fff',
      },
      centered: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
      },
      headerText: {
        fontSize: 28,
        fontWeight: 'bold',
      },
      avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      carouselSection: {
        marginTop: 20,
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 20,
        marginBottom: 15,
      },
      arrowContainer: {
        flexDirection: 'row',
        gap: 8,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom:25,
      },
      carousel: {
        paddingLeft: 20,
        paddingRight: 5,
      },
      card: {
        width: width * 0.7,
        maxWidth: 300,
        marginRight: 15,
        backgroundColor: '#fff',
      },
      cardImagePlaceholder: {
        width: '100%',
        height: 180,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        marginBottom: 12,
      },
      cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
      },
      ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      ratingText: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: 'bold',
      },
      reviewsText: {
        color: '#666',
        fontWeight: 'normal',
      },
      cardAddress: {
        fontSize: 15,
        color: '#666',
        marginBottom: 8,
      },
      cardTypeContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
      },
      cardTypeText: {
        fontSize: 13,
        fontWeight: '500',
      },
      categorySection: {
        marginTop: 30,
        paddingHorizontal: 20,
        marginBottom: 40,
      },
      categoryGrid: {
        flexDirection: 'row',
        flexWrap: canFitAllInRow ? 'nowrap' : 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      categoryCard: {
        width: canFitAllInRow ? '23%' : (canFitTwoInRow ? '48%' : '100%'),
        height: 100,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'flex-start',
        padding: 10,
        alignItems: 'flex-end',
      },
      categoryImagePlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
      },
      categoryText: {
        fontSize: 11.5 + (canFitAllInRow ? (width * 0.23) / 40 : (canFitTwoInRow ? (width * 0.48) / 40 : (width - 40) / 40)),
        fontWeight: 'bold',
        color: 'black',
        zIndex: 1,
        textAlign: 'right',
      },
      categoryImage: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: Platform.OS === 'web' ? 130 : 105,
        height: Platform.OS === 'web' ? 120 : 100,
      },
      tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
        paddingBottom: 10,
      },
      tabItem: {
        alignItems: 'center',
      },
    });
  }, [width]);

  const onViewableItemsChangedRecommended = useCallback(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0) {
      setRecommendedIndex(viewableItems[0].index ?? 0);
      setIsRecommendedEnd(viewableItems.some(item => item.index === recommendedData.length - 1));
    }
  }, [recommendedData.length]);

  const onViewableItemsChangedNewToNaadi = useCallback(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0) {
      setNewToNaadiIndex(viewableItems[0].index ?? 0);
      setIsNewToNaadiEnd(viewableItems.some(item => item.index === newToNaadiData.length - 1));
    }
  }, [newToNaadiData.length]);

  const onViewableItemsChangedTrending = useCallback(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0) {
      setTrendingIndex(viewableItems[0].index ?? 0);
      setIsTrendingEnd(viewableItems.some(item => item.index === trendingData.length - 1));
    }
  }, [trendingData.length]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 51 }).current;

  const scroll = (ref: React.RefObject<FlatList<any> | null>, index: number) => {
    if (index >= 0) {
      ref.current?.scrollToIndex({ index, animated: true });
    }
  };

  const itemWidth = Math.min(width * 0.7, 300);
  const itemMargin = 15;
  const totalItemWidth = itemWidth + itemMargin;

  const getItemLayout = (data: any, index: number) => ({
    length: totalItemWidth,
    offset: totalItemWidth * index,
    index,
  });

  const categories = [
    { name: 'Fitness' },
    { name: 'Beauty' },
    { name: 'Motors & Watercraft' },
    { name: 'Wellness' },
  ];

  const renderEstablishmentCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardImagePlaceholder} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFC107" />
        <Text style={styles.ratingText}>{item.rating} <Text style={styles.reviewsText}>({item.reviews})</Text></Text>
      </View>
      <Text style={styles.cardAddress}>{item.address}</Text>
      <View style={styles.cardTypeContainer}>
        <Text style={styles.cardTypeText}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {Platform.OS !== 'web' && (
        <View style={styles.header}>
          <Text style={styles.headerText}>Hey, {session?.firstName}</Text>
          <TouchableOpacity onPress={signOut}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{session?.firstName?.charAt(0)}{session?.lastName?.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>)}

        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            {Platform.OS === 'web' && (
              <View style={styles.arrowContainer}>
                <TouchableOpacity onPress={() => scroll(recommendedRef, recommendedIndex - 1)} disabled={recommendedIndex === 0}>
                  <Ionicons name="arrow-back-circle-outline" size={32} color={recommendedIndex === 0 ? "#ccc" : "#000"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scroll(recommendedRef, recommendedIndex + 1)} disabled={isRecommendedEnd}>
                  <Ionicons name="arrow-forward-circle-outline" size={32} color={isRecommendedEnd ? "#ccc" : "#000"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <FlatList
            ref={recommendedRef}
            data={recommendedData}
            renderItem={renderEstablishmentCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            getItemLayout={getItemLayout}
            onViewableItemsChanged={onViewableItemsChangedRecommended}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={200}
          />
        </View>

        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New to Naadi</Text>
            {Platform.OS === 'web' && (
              <View style={styles.arrowContainer}>
                <TouchableOpacity onPress={() => scroll(newToNaadiRef, newToNaadiIndex - 1)} disabled={newToNaadiIndex === 0}>
                  <Ionicons name="arrow-back-circle-outline" size={32} color={newToNaadiIndex === 0 ? "#ccc" : "#000"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scroll(newToNaadiRef, newToNaadiIndex + 1)} disabled={isNewToNaadiEnd}>
                  <Ionicons name="arrow-forward-circle-outline" size={32} color={isNewToNaadiEnd ? "#ccc" : "#000"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <FlatList
            ref={newToNaadiRef}
            data={newToNaadiData}
            renderItem={renderEstablishmentCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            getItemLayout={getItemLayout}
            onViewableItemsChanged={onViewableItemsChangedNewToNaadi}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={200}
          />
        </View>

        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            {Platform.OS === 'web' && (
              <View style={styles.arrowContainer}>
                <TouchableOpacity onPress={() => scroll(trendingRef, trendingIndex - 1)} disabled={trendingIndex === 0}>
                  <Ionicons name="arrow-back-circle-outline" size={32} color={trendingIndex === 0 ? "#ccc" : "#000"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scroll(trendingRef, trendingIndex + 1)} disabled={isTrendingEnd}>
                  <Ionicons name="arrow-forward-circle-outline" size={32} color={isTrendingEnd ? "#ccc" : "#000"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <FlatList
            ref={trendingRef}
            data={trendingData}
            renderItem={renderEstablishmentCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            getItemLayout={getItemLayout}
            onViewableItemsChanged={onViewableItemsChangedTrending}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={200}
          />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.name} style={styles.categoryCard}>
                <Text style={styles.categoryText}>{category.name}</Text>
                {category.name === 'Fitness' &&
                  <Image source={require('../../(assets)/fitness.png')} style={styles.categoryImage} />
                }
                {category.name === 'Motors & Watercraft' &&
                  <Image source={require('../../(assets)/motorsAndWatercrafts.png')} style={styles.categoryImage} />
                }
                {category.name === 'Wellness' &&
                  <Image source={require('../../(assets)/wellness.png')} style={styles.categoryImage} />
                }
                {category.name === 'Beauty' &&
                  <Image source={require('../../(assets)/beauty.png')} style={styles.categoryImage} />
                }
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {Platform.OS === 'web' && <Footer />}
      </ScrollView>
    </SafeAreaView>
  );
}