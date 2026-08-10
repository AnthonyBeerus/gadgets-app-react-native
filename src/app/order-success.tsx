import { Redirect, useLocalSearchParams } from 'expo-router';
export default function LegacyOrderSuccessRedirect() { const { orderId } = useLocalSearchParams<{ orderId?: string }>(); return <Redirect href={{ pathname: '/payment-processing', params: { orderId: orderId ?? '' } }} />; }
