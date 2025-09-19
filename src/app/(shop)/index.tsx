import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ShopsScreen from "../../components/shops-screen";

const Home = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ShopsScreen />
    </SafeAreaView>
  );
};

export default Home;
