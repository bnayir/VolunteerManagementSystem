import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

// Tanıtım Sayfaları Verisi
const SLIDES = [
  {
    id: '1',
    title: 'Hoş Geldin! 👋',
    description: 'Antalya’nın en büyük gönüllülük ağına katıldın. Fark yaratmaya hazır mısın?',
    backgroundColor: '#007AFF',
    icon: '🌟'
  },
  {
    id: '2',
    title: 'Etkinlikleri Keşfet 📍',
    description: 'Sana en yakın sosyal sorumluluk projelerini bul ve tek tıkla başvurunu yap.',
    backgroundColor: '#4CD964',
    icon: '🌍'
  },
  {
    id: '3',
    title: 'Kahraman Ol! 🏆',
    description: 'Katıldığın her etkinlikte puan ve rozet kazan, topluma değer katarken profilini yükselt.',
    backgroundColor: '#FF9500',
    icon: '🥇'
  }
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login'); // Son sayfada Login'e gönder
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={viewableItemsChanged}
        ref={slidesRef}
        keyExtractor={(item) => item.id}
      />

      {/* Alt Kontrol Alanı (Noktalar ve Buton) */}
      <View style={styles.footer}>
        {/* Sayfa Göstergeleri (Noktalar) */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp'
            });
            return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
          })}
        </View>

        {/* Dinamik Buton */}
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {currentIndex === SLIDES.length - 1 ? 'Hadi Başlayalım!' : 'Sonraki'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { width, height, justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { fontSize: 100, marginBottom: 30 },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 15 },
  description: { fontSize: 16, color: '#f0f0f0', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  footer: { position: 'absolute', bottom: 50, width: '100%', alignItems: 'center' },
  indicatorContainer: { flexDirection: 'row', marginBottom: 30 },
  dot: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#fff', marginHorizontal: 8 },
  btn: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30, elevation: 5 },
  btnText: { color: '#333', fontSize: 18, fontWeight: 'bold' }
});

export default Onboarding;