import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  BackHandler,
} from 'react-native';

const Flashcards = ({ category, onBack, orientation }) => {
  const [data, setData] = useState(category.flashcards);
  const swipe = useRef(new Animated.ValueXY()).current;
  const backOpacity = useRef(new Animated.Value(1)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (!data.length) {
      setData(category.flashcards);
    }
  }, [data, category.flashcards]);

  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBack]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) => {
        swipe.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        const isActionActive = Math.abs(dx) > 100 || Math.abs(dy) > 100;
        if (isActionActive) {
          Animated.timing(swipe, {
            toValue: { x: dx > 0 ? width : -width, y: dy > 0 ? height : -height },
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            removeCard();
          });
        } else {
          Animated.spring(swipe, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const removeCard = useCallback(() => {
    setData((prevData) => prevData.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  const handleSelection = useCallback(
    (direction) => {
      Animated.timing(swipe, {
        toValue: { x: direction * width, y: 0 },
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        removeCard();
      });
    },
    [removeCard, swipe]
  );

  const handleNext = useCallback(() => {
    handleSelection(1);
  }, [handleSelection]);

  const handlePressIn = () => {
    Animated.timing(backOpacity, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(backOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onBack();
    });
  };

  return (
    <View style={[styles.container, orientation === 'landscape' && styles.landscapeContainer]}>
      {data.map((flashcard, index) => {
        const isFirst = index === 0;
        const dragHandlers = isFirst ? panResponder.panHandlers : {};

        return (
          <Animated.View
            key={flashcard.id}
            style={[
              styles.card,
              orientation === 'landscape' ? styles.landscapeCard : styles.portraitCard,
              { zIndex: data.length - index },
              isFirst && { transform: [{ translateX: swipe.x }, { translateY: swipe.y }] },
              Platform.OS === 'web' && styles.webCard,
            ]}
            {...dragHandlers}
          >
            <Image source={flashcard.image} style={[orientation === 'landscape' ? styles.landscapeImage : styles.portraitImage]} />
            <Text style={styles.text}>{flashcard.name}</Text>
          </Animated.View>
        );
      }).reverse()}
      {orientation !== 'landscape' && (
        <View style={styles.buttonContainer}>
          <Animated.View style={{ opacity: backOpacity }}>
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back to Categories</Text>
            </TouchableOpacity>
          </Animated.View>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={styles.webButton} onPress={handleNext}>
              <Text style={styles.webButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B3E5FC',
  },
  landscapeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  portraitCard: {
    width: Math.min(width * 0.8, 350),
    height: Math.min(height * 0.6, 500),
  },
  landscapeCard: {
    width: Math.min(width * 0.6, 400),
    height: Math.min(height * 0.4, 300),
    marginBottom: 80,
  },
  webCard: {
    width: '60%',
    height: '80%',
  },
  portraitImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
  },
  landscapeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  webButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Flashcards;
