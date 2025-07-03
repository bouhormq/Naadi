import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { name: 'Fitness' },
  { name: 'Beauty' },
  { name: 'Motors & Watercraft' },
  { name: 'Wellness' },
];

interface CategoriesProps {
  variant?: 'default' | 'modal';
  onCategorySelect?: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ variant = 'default', onCategorySelect }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const handleCategoryPress = (categoryName: string) => {
    if (variant === 'default') {
      navigation.navigate('search', {
        initialActivity: categoryName,
        triggerSearch: true,
      });
    } else {
      onCategorySelect?.(categoryName);
    }
  };

  const styles = useMemo(() => {
    const breakpointRow = 1200;
    const breakpointColumn = 800;
    const canFitAllInRow = Platform.OS === 'web' && width > breakpointRow;
    const canFitTwoInRow = Platform.OS === 'web' && width > breakpointColumn;
    const isModal = variant === 'modal';

    return StyleSheet.create({
      categorySection: {
        marginTop: isModal ? 15 : 30,
        paddingHorizontal: isModal ? 0 : 20,
        marginBottom: isModal ? 0 : 40,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
      },
      categoryGrid: {
        flexDirection: 'row',
        flexWrap: canFitAllInRow ? 'nowrap' : 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      categoryCard: {
        width: canFitAllInRow ? '24%' : (canFitTwoInRow ? '48.5%' : '100%'),
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
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      categoryContainer: {
        width: '23%',
        alignItems: 'center',
        marginBottom: 20,
      },
      iconContainer: {
        marginBottom: 5,
      },
    });
  }, [width, variant]);

  return (
    <View style={styles.categorySection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.name)}
          >
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
  );
};

export default Categories;
