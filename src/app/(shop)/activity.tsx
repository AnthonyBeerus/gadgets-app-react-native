import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

const activityLinks = [
  { href: '/saved-opportunities', icon: 'heart-outline', title: 'Saved opportunities', detail: 'Briefs you want to revisit' },
  { href: '/(shop)/challenges/my-entries', icon: 'videocam-outline', title: 'My entries', detail: 'Submission, review, and judging status' },
  { href: '/orders', icon: 'receipt-outline', title: 'Orders and purchase proof', detail: 'Qualifying Muse purchases' },
] as const;

export default function ActivityScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 20, paddingTop: 64, paddingBottom: 110, gap: 22, backgroundColor: '#F8F6F8', flexGrow: 1 }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: '#171217' }}>Activity</Text>
        <Text style={{ fontSize: 15, lineHeight: 22, color: '#655C65' }}>Everything between saving a brief and getting paid.</Text>
      </View>
      <View style={{ gap: 12 }}>
        {activityLinks.map(item => (
          <Link key={item.title} href={item.href} asChild>
            <Pressable style={{ minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: '#E2DCE2', borderRadius: 18, backgroundColor: '#FFFFFF', padding: 16 }}>
              <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#F2EAF7' }}>
                <Ionicons name={item.icon} size={23} color="#6A1B9A" />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#171217' }}>{item.title}</Text>
                <Text style={{ fontSize: 13, color: '#655C65' }}>{item.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color="#8B818B" />
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
