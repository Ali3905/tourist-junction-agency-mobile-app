import React, { useState, useRef, useEffect } from "react";
import { View, Image, Dimensions, FlatList, StyleSheet, Text } from "react-native";

const { width } = Dimensions.get("window");

const Carousel = ({ images = [], height = 200, interval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Auto-slide effect
  useEffect(() => {
    if (images.length > 0) {
      const slideInterval = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, interval);

      return () => clearInterval(slideInterval); // Cleanup interval on unmount
    }
  }, [images, interval]);

  if (images.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImagesText}>No images to display</Text>
      </View>
    );
  }

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
            style={[styles.image, { height }]} // Apply height prop here
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        snapToAlignment="start"
        decelerationRate="fast"
      />
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
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
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width - 30, // Keep a padding from the screen edges
    resizeMode: "cover", // Adjust the image scaling
    borderRadius: 10, // Rounded corners
  },
  dotContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  noImagesText: {
    fontSize: 16,
    color: "#555",
  },
});

export default Carousel;
