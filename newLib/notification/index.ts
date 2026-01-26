import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';
import React from 'react';
import { Platform } from 'react-native';

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
  channels?: Notifications.NotificationChannel[];
}

export const getNotificationPermissions = async () => {
  const { status } = await getPermissionsAsync();
  return status;
};

export const requestNotificationPermissions = async () => {
  const { status } = await requestPermissionsAsync({
    ios: {
      allowBadge: true,
      allowProvisional: false,
      provideAppNotificationSettings: true,
      allowAlert: true,
      allowSound: true,
    },
    android: {},
  });
  return status;
};

export const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  if (Device.isDevice) {
    const existingStatus = await getNotificationPermissions();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      finalStatus = await requestNotificationPermissions();
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return undefined;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
      return undefined;
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        importance: Notifications.AndroidImportance.MAX,
        lightColor: '#FF231F7C',
        name: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    Notifications.setNotificationCategoryAsync(
      'default',
      [
        {
          buttonTitle: 'View',
          identifier: 'view',
          options: {
            isAuthenticationRequired: false,
            isDestructive: false,
          },
        },
      ],
      {
        showTitle: true,
        showSubtitle: true,
      }
    );
    Notifications.getPresentedNotificationsAsync();
    try {
      const pushToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('pushToken', pushToken);
      return pushToken;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
      return undefined;
    }
  }
  handleRegistrationError('Must use physical device for push notifications');
  return undefined;
};

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
      // Expo SDK 49+ NotificationBehavior
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = React.useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = React.useState<Notifications.Notification | undefined>();
  const [channels, setChannels] = React.useState<Notifications.NotificationChannel[]>([]);
  const notificationListener = React.useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = React.useRef<Notifications.EventSubscription | undefined>(undefined);

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) => {
      setExpoPushToken(token);
    });
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { channels, expoPushToken, notification };
};

const handleRegistrationError = (message: string) => {
  // Centralized error logging for enterprise
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error(`[PushNotification] ${message}`);
  } else {
    // TODO: Integrate with enterprise logging/monitoring (e.g., Sentry)
  }
};

export const schedulePushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
      title: "You've got mail! 📬",
    },
    trigger: {
      channelId: 'default',
      seconds: 2,
    },
  });
};

export const useNotificationObserver = (
  redirect: (notification: Notifications.Notification) => void
) => {
  React.useEffect(() => {
    let isMounted = true;
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [redirect]);
};

export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export const resetNotification = async () => {
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.setBadgeCountAsync(0);
};
