import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList, Linking } from 'react-native';
import { location } from '../constants/icons';
import colors from '../constants/colors';


const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32; // Assuming 16px margin on each side

const TiffinCard = ({
  image = [],
  title,
  rating,
  timing,
  rate,
  thaliType,
  cuisineType,
  onPress,
  isVisible = true ,// New prop to control auto-scroll
 latitude,
longitude,

}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-scroll only when card is visible and has multiple images
  useEffect(() => {
    if (image.length > 1 && isVisible) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll(); // Cleanup on unmount
  }, [currentIndex, image.length, isVisible]);

  const startAutoScroll = () => {
    stopAutoScroll(); // Clear any existing interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % image.length;
        sliderRef.current?.scrollToIndex({ 
          index: nextIndex, 
          animated: true 
        });
        return nextIndex;
      });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < image.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setCurrentIndex(newIndex);
    // Restart auto-scroll after manual scroll ends, only if visible
    if (image.length > 1 && isVisible) {
      setTimeout(() => startAutoScroll(), 500);
    }
  };

  const handleCardPress = () => {
    // Stop auto-scroll when navigating
    stopAutoScroll();
    if (onPress) {
      onPress();
    }
  };

  const handleImagePress = () => {
    // Simple handler without event manipulation
    handleCardPress();
  };

const openMap = () => {
  if (latitude && longitude) {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('Failed to open map:', err));
  }
};



  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        onPress={handleImagePress}
        activeOpacity={0.9}
        style={{ width: cardWidth }}
      >
        <Image 
          source={item} 
          style={styles.image}
          onError={(error) => {
            console.log('Image load error:', error.nativeEvent.error);
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderDotIndicators = () => {
    if (image.length <= 1) return null;
    
    return (
      <View style={styles.dotContainer}>
        {image.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)' }
            ]}
            onPress={() => {
              sliderRef.current?.scrollToIndex({ index, animated: true });
              setCurrentIndex(index);
              stopAutoScroll();
              if (image.length > 1 && isVisible) {
                setTimeout(() => startAutoScroll(), 500);
              }
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handleCardPress}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <FlatList
          data={image}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ref={sliderRef}
          scrollEnabled={true}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollBeginDrag={stopAutoScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
          })}
          removeClippedSubviews={false}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
        />
        {renderDotIndicators()}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {rating}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.timing}>{timing}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.chip}>{thaliType}</Text>
          <Text style={styles.chip}>{cuisineType}</Text>
        </View>

      <View style={{flexDirection:"row", justifyContent:'space-between'}}>
          <Text style={styles.rate}>₹{rate}</Text>
        <View style={styles.row}>
  <TouchableOpacity onPress={openMap} style={styles.mapButton}>
  <Image source={location} style={styles.mapIcon} />
  <Text style={styles.mapText}>View on Map</Text>
</TouchableOpacity>

</View>
      </View>
      </View>
      

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: cardWidth,
    height: 200,
    resizeMode: 'cover',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  infoContainer: {
    paddingTop: 16,
    paddingHorizontal:16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginBottom: 12,
},

mapIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
  marginRight: 6,
},

mapText: {
  fontSize: 14,
  color: colors.brown,
  fontWeight: '500',
},

  rating: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timing: {
    fontSize: 14,
    color: '#666',
  },
  dotSeparator: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 8,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  rate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 4,
  },
});

export default TiffinCard;