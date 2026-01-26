import { authApi } from '@/services/api/auth';
import { useUserStore } from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
// import { Alert } from 'react-native'; // Removed unused import
import Toast from 'react-native-toast-message';


export const useLoginMutation = () => {
  const router = useRouter();


  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data, variables) => {
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1:  'Error',
        text2: 'Something went wrong please try again',
      });
    },
  });
};

export const useSendOtpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: (data, variables) => {
       router.push({ pathname: '/auth/verify', params: { mobile: variables.mobile } });
    },
    onError: (error: any) => {
       console.error(error);
       Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Please enter valid mobile number",
      });
    },
  });
};

export const useVerifyOtpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data, variables) => {
      useUserStore.setState({
        accessToken: data.data.token,
        refreshToken: "",
        isAuthenticated: true,
      })
       router.replace('/(main)/(tabs)');
    },
    onError: (error: any) => {
       console.error(error);
       Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Please enter valid OTP",
      });
    },
  });
};
