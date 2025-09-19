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

const COLORS = {
  primary: "#1BC464",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  border: "#E5E5E7",
  red: "#FF3B30",
};

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
          <IconComponent name={icon as any} size={20} color={COLORS.primary} />
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
          color={COLORS.textSecondary}
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
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="person"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {}}
            />
            <ProfileOption
              icon="notifications"
              title="Notifications"
              subtitle="Manage your notification preferences"
              onPress={() => {}}
            />
            <ProfileOption
              icon="security"
              title="Privacy & Security"
              subtitle="Password, two-factor authentication"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Shopping Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopping</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="favorite"
              title="Wishlist"
              subtitle="Items you want to buy later"
              onPress={() => {}}
            />
            <ProfileOption
              icon="location-on"
              title="Addresses"
              subtitle="Manage your delivery addresses"
              onPress={() => {}}
            />
            <ProfileOption
              icon="payment"
              title="Payment Methods"
              subtitle="Credit cards, PayPal, and more"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="help"
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => {}}
            />
            <ProfileOption
              icon="feedback"
              title="Send Feedback"
              subtitle="Tell us how we can improve"
              onPress={() => {}}
            />
            <ProfileOption
              icon="info"
              title="About"
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
              title="Sign Out"
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  userTypeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  userTypeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  optionsContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 100, // Extra space for bottom tab bar
  },
});
