import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Dimensions, FlatList, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({ images, height }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Auto-play effect with setInterval
  useEffect(() => {
    if (images && images.length > 0) {  // Guard against empty images array
      const interval = setInterval(() => {
        const nextIndex = activeIndex + 1 >= images.length ? 0 : activeIndex + 1;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [activeIndex, images]); // Added `images` as a dependency to reset interval on data change

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={item.uri ? { uri: item.uri } : { uri: item }}
            style={[
              styles.image,
              { height: height }, // Apply the height prop directly to the style
            ]}
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        snapToAlignment="start"
        decelerationRate="fast"
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
      />

      <View style={styles.dotContainer}>
        {images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === activeIndex ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width - 40, // Keep a padding from the screen edges
    resizeMode: 'cover', // Adjust the image scaling
    borderRadius: 20, // Apply extra-large rounding for an "xl" effect
  },
  dotContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
});

export default Carousel;
