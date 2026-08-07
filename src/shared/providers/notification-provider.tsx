import { useEffect, PropsWithChildren } from "react";
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { supabase } from "../lib/supabase";

const NotificationProvider = ({ children }: PropsWithChildren) => {
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
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      return;
    }

    let disposed = false;
    let notificationSubscription: { remove: () => void } | undefined;
    let responseSubscription: { remove: () => void } | undefined;

    void Promise.all([
      import('expo-notifications'),
      import('../lib/notifications'),
    ]).then(([Notifications, registration]) => {
      if (disposed) return;
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      notificationSubscription = Notifications.addNotificationReceivedListener(() => {});
      responseSubscription = Notifications.addNotificationResponseReceivedListener(() => {});
      return registration.default().then(token => saveUserPushNotificationToken(token ?? ''));
    }).catch((error: Error) => {
      console.warn('[Notifications] Setup skipped:', error.message);
    });

    return () => {
      disposed = true;
      notificationSubscription?.remove();
      responseSubscription?.remove();
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
