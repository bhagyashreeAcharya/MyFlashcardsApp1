import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions, View, StyleSheet } from 'react-native';
import Categories from './components/Categories';
import Flashcards from './components/Flashcards';
import flashcardsData from './data/flashcardsData';

const Stack = createStackNavigator();

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  const handleSelectCategory = (categoryId) => {
    const category = flashcardsData.categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {selectedCategory ? (
            <Stack.Screen name="Flashcards">
              {(props) => (
                <Flashcards
                  {...props}
                  category={selectedCategory}
                  onBack={handleBack}
                  orientation={orientation}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Categories">
              {(props) => (
                <Categories
                  {...props}
                  categories={flashcardsData.categories}
                  onSelectCategory={handleSelectCategory}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6', // Sky blue color
  },
});

export default App;
