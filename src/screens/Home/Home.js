import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import TiffinCard from '../../components/Card'; 
import image1 from '../../../assets/tiffin1.jpg'


const Home = () => {
  const tiffinData = [
  {
    id: '1',
    image: "",
    title: 'Raju’s Tiffin',
    rating: '4.5',
    timing: '9:00 AM - 2:00 PM',
    rate: 120,
    thaliType: 'Veg',
    cuisineType: 'North Indian',
  },
  {
    id: '2',
    image: "",
    title: 'Mummy Da Dhaba',
    rating: '4.8',
    timing: '11:00 AM - 3:00 PM',
    rate: 150,
    thaliType: 'Non-Veg',
    cuisineType: 'Punjabi',
  },
  {
    id: '3',
    image: "",
    title: 'Healthy Bites',
    rating: '4.2',
    timing: '10:00 AM - 1:30 PM',
    rate: 100,
    thaliType: 'Veg',
    cuisineType: 'South Indian',
  },
  {
    id: '4',
    image: "",
    title: 'Spicy Treats',
    rating: '4.0',
    timing: '12:00 PM - 3:00 PM',
    rate: 130,
    thaliType: 'Veg',
    cuisineType: 'Gujarati',
  },
  {
    id: '5',
    image: "",
    title: 'Desi Kitchen',
    rating: '4.7',
    timing: '10:30 AM - 2:30 PM',
    rate: 140,
    thaliType: 'Non-Veg',
    cuisineType: 'Biryani Special',
  },
  {
    id: '6',
    image: "",
    title: 'Tiffin Express',
    rating: '4.3',
    timing: '11:00 AM - 3:30 PM',
    rate: 110,
    thaliType: 'Veg',
    cuisineType: 'Maharashtrian',
  },
  {
    id: '7',
    image: "",
    title: 'Quick Bites',
    rating: '4.6',
    timing: '9:30 AM - 1:00 PM',
    rate: 125,
    thaliType: 'Veg',
    cuisineType: 'Rajasthani',
  },
];



  return (
    <ScrollView>
      <View style={{ paddingVertical: 16 }}>
        {tiffinData?.map((item) => (
          <TiffinCard
            key={item.id}
            image={item.image}
            title={item.title}
            rating={item.rating}
            timing={item.timing}
            rate={item.rate}
            thaliType={item.thaliType}
            cuisineType={item.cuisineType}
            onPress={() => console.log(`${item.title} pressed`)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;
