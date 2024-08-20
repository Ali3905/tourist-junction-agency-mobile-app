import { StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';

interface BlurOverlayProps {
    visible: boolean;
    onRequestClose: () => void;
}

type ConfirmationModalProps = {
    isVisible : boolean,
    closeModal: () => void,
    message: string,
    actionBtnText: string,
    handler: () => void,
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
    >
        <TouchableWithoutFeedback onPress={onRequestClose}>
            <BlurView intensity={90} tint="light" style={styles.overlay} />
        </TouchableWithoutFeedback>
    </Modal>
);

export default function ConfirmationModal({ isVisible, closeModal, message, actionBtnText, handler }: ConfirmationModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}
        >
            <BlurOverlay visible={isVisible} onRequestClose={closeModal} />

            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={closeModal}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handler}>
                            <Text style={[styles.modalButtonText, { color: "#fff" }]}>{actionBtnText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 5,
        width: 100,
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
    },
})