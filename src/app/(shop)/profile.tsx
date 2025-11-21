import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../providers/auth-provider";
import { supabase } from "../../lib/supabase";
import { NEO_THEME } from "../../constants/neobrutalism";

const ProfileOption = ({
  icon,
  title,
  subtitle,
  onPress,
  iconType = "MaterialIcons",
  showArrow = true,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconType?: "MaterialIcons" | "FontAwesome";
  showArrow?: boolean;
}) => {
  const IconComponent =
    iconType === "FontAwesome" ? FontAwesome : MaterialIcons;

  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <IconComponent name={icon as any} size={20} color={NEO_THEME.colors.white} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={NEO_THEME.colors.black}
        />
      )}
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { user, session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri:
                  user?.avatar_url ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.email?.split("@")[0] || "User"}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userTypeBadge}>
                <Text style={styles.userTypeText}>{user?.type || "USER"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="person"
              title="EDIT PROFILE"
              subtitle="Update your personal information"
              onPress={() => {}}
            />
            <ProfileOption
              icon="notifications"
              title="NOTIFICATIONS"
              subtitle="Manage your notification preferences"
              onPress={() => {}}
            />
            <ProfileOption
              icon="security"
              title="PRIVACY & SECURITY"
              subtitle="Password, two-factor authentication"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Shopping Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHOPPING</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="favorite"
              title="WISHLIST"
              subtitle="Items you want to buy later"
              onPress={() => {}}
            />
            <ProfileOption
              icon="location-on"
              title="ADDRESSES"
              subtitle="Manage your delivery addresses"
              onPress={() => {}}
            />
            <ProfileOption
              icon="payment"
              title="PAYMENT METHODS"
              subtitle="Credit cards, PayPal, and more"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="help"
              title="HELP CENTER"
              subtitle="Get help and support"
              onPress={() => {}}
            />
            <ProfileOption
              icon="feedback"
              title="SEND FEEDBACK"
              subtitle="Tell us how we can improve"
              onPress={() => {}}
            />
            <ProfileOption
              icon="info"
              title="ABOUT"
              subtitle="App version and legal information"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="logout"
              title="SIGN OUT"
              onPress={handleSignOut}
              showArrow={false}
            />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  header: {
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: NEO_THEME.borders.radius,
    marginRight: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  userEmail: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginBottom: 8,
  },
  userTypeBadge: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  userTypeText: {
    color: NEO_THEME.colors.black,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginHorizontal: 20,
    marginBottom: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  optionsContainer: {
    backgroundColor: NEO_THEME.colors.white,
    marginHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    overflow: "hidden",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: NEO_THEME.colors.black,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 2,
    fontFamily: NEO_THEME.fonts.black,
  },
  optionSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
  bottomSpacing: {
    height: 100,
  },
});
