import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';

const categories = [
  { name: 'Fitness' },
  { name: 'Beauty' },
  { name: 'Motors & Watercraft' },
  { name: 'Wellness' },
];

const Categories = () => {
  const { width } = useWindowDimensions();

  const styles = useMemo(() => {
    const breakpointRow = 1200;
    const breakpointColumn = 800;
    const canFitAllInRow = Platform.OS === 'web' && width > breakpointRow;
    const canFitTwoInRow = Platform.OS === 'web' && width > breakpointColumn;

    return StyleSheet.create({
      categorySection: {
        marginTop: 30,
        paddingHorizontal: 20,
        marginBottom: 40,
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
    });
  }, [width]);

  return (
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
  );
};

export default Categories;
