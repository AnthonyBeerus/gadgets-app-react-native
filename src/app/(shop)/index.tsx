import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShopsScreen from "../../features/shop/screens/ShopsScreen";

const Home = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ShopsScreen />
    </SafeAreaView>
  );
};

export default Home;
