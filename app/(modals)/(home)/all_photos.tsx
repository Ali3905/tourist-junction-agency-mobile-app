import FloatingButton from '@/components/FloatingButton';
import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
    View,
    Dimensions
} from 'react-native';

const images = [
    'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
    'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
    'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg'
];

const numColumns = 2;
const imageSize = Dimensions.get('window').width / numColumns;

const GalleryGridScreen: React.FC = () => {

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
            />
            <FloatingButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        flex: 1,
        margin: 2,
    },
    image: {
        width: imageSize - 4,
        height: imageSize - 4,
    },
});

export default GalleryGridScreen;
