import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Animated, Platform } from 'react-native';

const Categories = ({ categories, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scaleValues = useRef(categories.reduce((acc, category) => {
    acc[category.id] = new Animated.Value(1);
    return acc;
  }, {})).current;

  const opacityValues = useRef(categories.reduce((acc, category) => {
    acc[category.id] = new Animated.Value(1);
    return acc;
  }, {})).current;

  const slideAnimation = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation]);

  const handlePressIn = (id) => {
    Animated.parallel([
      Animated.spring(scaleValues[id], {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValues[id], {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = (id) => {
    Animated.parallel([
      Animated.spring(scaleValues[id], {
        toValue: 1,
        friction: 4,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValues[id], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (id) => {
    if (selectedCategory && selectedCategory.id === id) {
      onSelectCategory(id);
    } else {
      setSelectedCategory(categories.find(category => category.id === id));
    }
  };

  const getRainbowText = (text) => {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
    return text.split('').map((char, index) => (
      <Text key={index} style={{ color: colors[index % colors.length] }}>
        {char}
      </Text>
    ));
  };

  return (
    <View style={styles.outerContainer}>
      {/* Scrollable Categories (Train Engine and Compartments) */}
      <ScrollView horizontal contentContainerStyle={styles.container} showsHorizontalScrollIndicator={false}>
        <Image source={require('../assets/images/engine.png')} style={styles.engine} />
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPressIn={() => handlePressIn(category.id)}
            onPressOut={() => handlePressOut(category.id)}
            onPress={() => handlePress(category.id)}
            activeOpacity={1}
          >
            <Animated.View style={[styles.compartment, { opacity: opacityValues[category.id] }]}>
              <View style={styles.overlayContainer}>
                <Animated.Image
                  source={require('../assets/images/compartment.png')}
                  style={[styles.compartmentImage, { transform: [{ scale: scaleValues[category.id] }] }]}
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory && selectedCategory.id === category.id && styles.selectedText
                ]}>{category.name}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Heading Container (Learning Express) */}
      <Animated.View style={[styles.headingContainer, { transform: [{ translateX: slideAnimation }] }]}>
        <Text style={styles.heading}>
          {getRainbowText('Learning Express')}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#B3E5FC',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headingContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Comic Sans MS' : 'sans-serif-medium',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  engine: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  compartment: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  overlayContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    backgroundColor: '#B3E5FC',
  },
  compartmentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categoryText: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedText: {
    color: 'red',
  },
});

export default Categories;
