import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderIcon from '@/assets/icons/header_icon.svg';
import { OtpInput } from '@/components/ui/OtpInput';
import { ThemedText } from '@/newLib/ThemedText';
import { moderateScale } from '@/newLib/responsive';
import { useTheme } from '@/newLib/theme/hooks/useTheme';
import { useVerifyOtpMutation } from '@/services/queries/auth';
import { SPACING } from '@/theme/spacing';

export default function VerifyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [otp, setOtp] = useState('');
  
  const { mobile } = useLocalSearchParams(); 
 
  const {mutate, isPending} = useVerifyOtpMutation();

  const handleVerify = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }
    mutate({ otp, mobile: mobile as string }); 
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
                 <HeaderIcon width={150} height={50} /> 
            </View>

            <View style={styles.titleContainer}>
              <ThemedText variant="title" style={styles.title}>Verify Account</ThemedText>
              <ThemedText variant="description" color="primary" style={styles.subtitle}>
                Enter the code sent to {mobile}
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
              {/* OTP Input Component */}
              <View style={styles.otpWrapper}>
                <OtpInput
                  length={5}
                  value={otp}
                  onChange={setOtp}
                />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: 'black' }]} 
                onPress={handleVerify}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ThemedText variant="text16B" color="background">Verify</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.space08,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.space09,
  },
  logoContainer: {
    marginBottom: SPACING.space09,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.space11,
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    marginBottom: SPACING.space04,
  },
  subtitle: {
    textAlign: 'center',
  },
  formContainer: {
    flex:1,
    justifyContent:"space-between",
    gap: SPACING.space06,
  },
  otpWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    height: moderateScale(56),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.space08,
  },

});

