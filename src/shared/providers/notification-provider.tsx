import { useState, useEffect, useRef, PropsWithChildren } from "react";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "../lib/notifications";
import { supabase } from "../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const saveUserPushNotificationToken = async (token: string) => {
    if (!token.length) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    await supabase
      .from("users")
      .update({
        // @ts-ignore - expo_notification_token field may not be in schema yet
        expo_notification_token: token,
      })
      .eq("id", session.user.id);
  };

  useEffect(() => {
    // Gracefully handle notification setup failures (e.g., missing Firebase config)
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? "");
        saveUserPushNotificationToken(token ?? "");
      })
      .catch((error: any) => {
        console.warn('[Notifications] Failed to register:', error.message);
        // Don't crash the app if notifications fail
        setExpoPushToken("");
      });

    try {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    } catch (error) {
      console.warn('[Notifications] Failed to add listeners:', error);
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
