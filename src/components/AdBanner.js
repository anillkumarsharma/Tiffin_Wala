import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import colors from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const BANNER_WIDTH = screenWidth; 

// Sample ad data - you can fetch this from your backend or update as needed
const adData = [
  {
    id: 1,
    type: 'festival', // festival, discount, new_launch, seasonal
    title: 'Diwali Special Offer!',
    subtitle: '50% OFF on all Premium Thalis',
    description: 'Celebrate Diwali with authentic homemade meals',
    backgroundColor: colors.Yellow,
    textColor: '#FFFFFF',
    buttonText: 'Order Now',
    validUntil: '2024-11-15',
    image: 'https://example.com/diwali-banner.jpg', // You can use local images too
    tiffinCenter: 'Maharaja Tiffin Service',
    discount: '50%',
    emoji: '🪔'
  },
  {
    id: 2,
    type: 'discount',
    title: 'New Customer Special',
    subtitle: 'Get 30% OFF on your first order',
    description: 'Fresh, healthy meals delivered to your doorstep',
    backgroundColor: colors.grey,
    textColor: '#FFFFFF',
    buttonText: 'Claim Offer',
    validUntil: '2024-12-31',
    tiffinCenter: 'Green Valley Tiffins',
    discount: '30%',
    emoji: '🎉'
  },
  {
    id: 3,
    type: 'seasonal',
    title: 'Winter Special Menu',
    subtitle: 'Hot & Spicy Meals Available',
    description: 'Warm up your winter with our special hot meals',
    backgroundColor: colors.lightBlue,
    textColor: '#FFFFFF',
    buttonText: 'View Menu',
    validUntil: '2024-12-31',
    tiffinCenter: 'Spice Garden Tiffins',
    emoji: '🌶️'
  }
];

const AdBanner = ({ onAdPress }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState(adData);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-scroll functionality
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 4000); // Change ad every 4 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length, fadeAnim]);

  // Scroll to current ad
  useEffect(() => {
    if (scrollViewRef.current && ads.length > 1) {
      scrollViewRef.current.scrollTo({
        x: currentAdIndex * screenWidth,
        animated: true,
      });
    }
  }, [currentAdIndex]);

  const handleAdPress = (ad) => {
    if (onAdPress) {
      onAdPress(ad);
    }
    // You can also handle specific ad actions here
    console.log('Ad pressed:', ad.title);
  };

  const renderAd = (ad, index) => (
    <TouchableOpacity
      key={ad.id}
      style={[styles.adContainer, { backgroundColor: ad.backgroundColor }]}
      onPress={() => handleAdPress(ad)}
      activeOpacity={0.9}
    >
      <View style={styles.adContent}>
        {/* Left side - Text content */}
        <View style={styles.textSection}>
          
          
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[styles.adTitle, { color: ad.textColor }]}>
            {ad.title}
          </Text>
          <Text style={styles.emoji}>{ad.emoji}</Text>
          </View>
          
          <Text style={[styles.adSubtitle, { color: ad.textColor }]}>
            {ad.subtitle}
          </Text>
          
          <Text style={[styles.adDescription, { color: ad.textColor }]}>
            {ad.description}
          </Text>
          
          <View style={styles.tiffinCenterRow}>
            <Text style={[styles.tiffinCenter, { color: ad.textColor }]}>
              By {ad.tiffinCenter}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <View style={styles.ctaButton}>
              <Text style={[styles.ctaButtonText, { color: ad.backgroundColor }]}>
                {ad.buttonText}
              </Text>
            </View>
          </View>
        </View>

        {/* Right side - Visual elements */}
        <View style={styles.visualSection}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>LIMITED</Text>
            <Text style={styles.offerText}>TIME</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (ads.length === 0) {
    return null;
  }

  return (
    <View style={styles.bannerWrapper}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {ads.length === 1 ? (
          renderAd(ads[0], 0)
        ) : (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false} // Disable manual scrolling for auto-scroll
            style={styles.scrollView}
          >
            {ads.map((ad, index) => (
              <View key={ad.id} style={styles.adWrapper}>
                {renderAd(ad, index)}
              </View>
            ))}
          </ScrollView>
        )}
        
        {/* Pagination dots */}
        {ads.length > 1 && (
          <View style={styles.pagination}>
            {ads.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentAdIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: '#fff',
  },
  container: {
    height: 200,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
   adWrapper: {
    width: BANNER_WIDTH, // Use the calculated banner width
  },
  adContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    paddingRight:40,

  },
  adContent: {
    flex: 1,
    flexDirection: 'row',
  },
  textSection: {
    flex: 2,
    justifyContent: 'space-between',
  },
  visualSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 20,
  },
  discountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  adSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
  },
  tiffinCenterRow: {
    marginBottom: 8,
  },
  tiffinCenter: {
    fontSize: 11,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  offerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  offerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default AdBanner;