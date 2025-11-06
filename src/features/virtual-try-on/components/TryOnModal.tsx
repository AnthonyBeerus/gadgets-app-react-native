// filepath: src/features/virtual-try-on/components/TryOnModal.tsx
import React, { useEffect } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTryOnStore } from "../store/tryOnStore";
import { useProcessTryOn } from "../api/processTryOn";
import { GenerationMode } from "../types/TryOnTypes";
import ProductSelector from "./ProductSelector";
import ImagePickerComponent from "./ImagePicker";
import ResultOverlay from "./ResultOverlay";
// Use cross-fetch to avoid whatwg-fetch issues
import fetch from "cross-fetch";

interface TryOnModalProps {
  visible: boolean;
  onClose: () => void;
  shopProducts?: any[]; // Products from the shop
}

export default function TryOnModal({
  visible,
  onClose,
  shopProducts = [],
}: TryOnModalProps) {
  const {
    selectedProduct,
    userImage,
    resultImage,
    isProcessing,
    error,
    reset,
    setSelectedProduct,
  } = useTryOnStore();
  const processTryOnMutation = useProcessTryOn();
  const [hasAttempted, setHasAttempted] = React.useState(false);

  // Reset attempt flag when modal visibility or images change
  useEffect(() => {
    if (!visible) {
      setHasAttempted(false);
    }
  }, [visible]);

  // Auto-select product if only one is provided (e.g., from product details page)
  useEffect(() => {
    if (visible && shopProducts.length === 1 && !selectedProduct) {
      setSelectedProduct(shopProducts[0]);
    }
  }, [visible, shopProducts, selectedProduct]);

  // Auto-trigger try-on when both product and user image are selected
  useEffect(() => {
    if (
      selectedProduct &&
      userImage &&
      !resultImage &&
      !isProcessing &&
      !error &&
      !hasAttempted
    ) {
      setHasAttempted(true);
      // userImage is already base64 data URI from ImagePicker
      const userBase64 = userImage.includes("base64,")
        ? userImage.split("base64,")[1]
        : userImage;

      // Product image is a URL - need to fetch and convert to base64
      const processProductImage = async () => {
        try {
          const response = await fetch(selectedProduct.heroImage);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const productBase64 = (reader.result as string).split("base64,")[1];

            processTryOnMutation.mutate({
              targetImage: {
                base64: userBase64,
                mimeType: "image/jpeg",
              },
              sourceImage: {
                base64: productBase64,
                mimeType: "image/jpeg",
              },
              mode: GenerationMode.PRODUCT_TO_MODEL,
            });
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Failed to load product image:", error);
        }
      };

      processProductImage();
    }
  }, [
    selectedProduct,
    userImage,
    resultImage,
    isProcessing,
    error,
    hasAttempted,
  ]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRetry = async () => {
    setHasAttempted(false); // Reset the flag to allow retry
    if (selectedProduct && userImage) {
      const userBase64 = userImage.includes("base64,")
        ? userImage.split("base64,")[1]
        : userImage;

      try {
        const response = await fetch(selectedProduct.heroImage);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const productBase64 = (reader.result as string).split("base64,")[1];

          processTryOnMutation.mutate({
            targetImage: {
              base64: userBase64,
              mimeType: "image/jpeg",
            },
            sourceImage: {
              base64: productBase64,
              mimeType: "image/jpeg",
            },
            mode: GenerationMode.PRODUCT_TO_MODEL,
          });
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to load product image:", error);
      }
    }
  };

  const renderContent = () => {
    if (!selectedProduct) {
      return <ProductSelector products={shopProducts} />;
    }

    if (!userImage) {
      return <ImagePickerComponent />;
    }

    return <ResultOverlay onClose={handleClose} onRetry={handleRetry} />;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Try-On</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  closeButton: { fontSize: 24, color: "#666" },
});
