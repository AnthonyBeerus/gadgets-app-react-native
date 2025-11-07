// filepath: src/features/virtual-try-on/components/TryOnModal.tsx
import React, { useEffect } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTryOnStore } from "../store/tryOnStore";
import { useProcessTryOn } from "../api/processTryOn";
import {
  GenerationMode,
  PoseOption,
  BackgroundScene,
  ServiceType,
} from "../types/TryOnTypes";
import ProductSelector from "./ProductSelector";
import ImagePickerComponent from "./ImagePicker";
import ResultOverlay from "./ResultOverlay";
// Use cross-fetch to avoid whatwg-fetch issues
import fetch from "cross-fetch";

// Helper function to detect service type from product
const detectServiceType = (product: any): ServiceType => {
  // Check category - 4 is Beauty & Health
  if (product.category === 4) {
    const title = product.title?.toLowerCase() || "";

    // Check for hairstyle keywords
    if (
      title.includes("hair") ||
      title.includes("cut") ||
      title.includes("style") ||
      title.includes("braid") ||
      title.includes("curl") ||
      title.includes("color") ||
      title.includes("dreadlock") ||
      title.includes("afro") ||
      title.includes("beard")
    ) {
      return ServiceType.HAIRSTYLE;
    }

    // Check for nail keywords
    if (
      title.includes("nail") ||
      title.includes("manicure") ||
      title.includes("pedicure") ||
      title.includes("gel") ||
      title.includes("acrylic")
    ) {
      return ServiceType.NAILS;
    }

    // Check for makeup keywords
    if (
      title.includes("makeup") ||
      title.includes("glam") ||
      title.includes("foundation") ||
      title.includes("lipstick")
    ) {
      return ServiceType.MAKEUP;
    }
  }

  // Default to clothing
  return ServiceType.CLOTHING;
};

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
    pose,
    background,
  } = useTryOnStore();
  const processTryOnMutation = useProcessTryOn();
  const [hasAttempted, setHasAttempted] = React.useState(false);
  const [readyToGenerate, setReadyToGenerate] = React.useState(false);

  // Reset attempt flag when modal visibility or images change
  useEffect(() => {
    if (!visible) {
      setHasAttempted(false);
      setReadyToGenerate(false);
    }
  }, [visible]);

  // Auto-select product if only one is provided (e.g., from product details page)
  useEffect(() => {
    if (visible && shopProducts.length === 1 && !selectedProduct) {
      setSelectedProduct(shopProducts[0]);
    }
  }, [visible, shopProducts, selectedProduct]);

  // Trigger try-on when user clicks generate button
  useEffect(() => {
    if (
      readyToGenerate &&
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
            const serviceType = detectServiceType(selectedProduct);

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
              serviceType,
              pose,
              background,
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
    readyToGenerate,
    selectedProduct,
    userImage,
    resultImage,
    isProcessing,
    error,
    hasAttempted,
    pose,
    background,
  ]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRetry = async () => {
    setHasAttempted(false); // Reset the flag to allow retry
    setReadyToGenerate(false); // Reset ready flag
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
          const serviceType = detectServiceType(selectedProduct);

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
            serviceType,
            pose,
            background,
          });
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to load product image:", error);
      }
    }
  };

  const handleReadyToGenerate = () => {
    setReadyToGenerate(true);
  };

  const renderContent = () => {
    if (!selectedProduct) {
      return <ProductSelector products={shopProducts} />;
    }

    if (!userImage || !readyToGenerate) {
      return <ImagePickerComponent onReadyToGenerate={handleReadyToGenerate} />;
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 28,
    color: "#666",
    paddingHorizontal: 8,
  },
});
