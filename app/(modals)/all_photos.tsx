import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    Button
} from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';

const numColumns = 2;
const imageSize = Dimensions.get('window').width / numColumns;

interface Photo {
    _id: string;
    photos: string[];
}

const GalleryGridScreen: React.FC = () => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const { apiCaller } = useGlobalContext()

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await apiCaller.get('/api/vehicle/all/photos');
            if (response.data.success) {
                const allPhotos = response.data.data.flatMap((item: Photo) => item.photos);
                setPhotos(allPhotos);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };



    const toggleImageSelection = (image: string) => {
        setSelectedImages(prev =>
            prev.includes(image)
                ? prev.filter(img => img !== image)
                : [...prev, image]
        );
    };

    const shareImages = async () => {
        if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing isn't available on your platform");
            return;
        }

        const localFiles = await Promise.all(
            selectedImages.map(async (imageUrl, index) => {
                const fileName = `image_${index}.jpg`;
                const filePath = `${FileSystem.cacheDirectory}${fileName}`;
                await FileSystem.copyAsync({
                    from: imageUrl,
                    to: filePath
                });
                return filePath;
            })
        );

        try {
            for (const file of localFiles) {
                await Sharing.shareAsync(file, {
                    dialogTitle: 'Share this image',
                    mimeType: 'image/jpeg',
                    UTI: 'public.jpeg',
                });
            }
        } catch (error) {
            console.error('Error sharing images:', error);
        }
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => toggleImageSelection(item)}
        >
            <Image
                source={{ uri: item }}
                style={[
                    styles.image,
                    selectedImages.includes(item) && styles.selectedImage
                ]}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
            />
            <Button
                title={`Share (${selectedImages.length})`}
                onPress={shareImages}
                disabled={selectedImages.length === 0}
            />
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
    selectedImage: {
        opacity: 0.7,
        borderWidth: 2,
        borderColor: 'gray',
    },
});

export default GalleryGridScreen;