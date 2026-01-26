import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import HeaderIcon from '@/assets/icons/header_icon.svg';
import { ThemedText } from '@/newLib/ThemedText';
import { ThemedTextInput } from '@/newLib/ThemedTextInput';
import { moderateScale } from '@/newLib/responsive';
import { useTheme } from '@/newLib/theme/hooks/useTheme';
import { useSendOtpMutation } from '@/services/queries/auth';
import { SPACING } from '@/theme/spacing';

export default function LoginScreen() {
  const { theme } = useTheme();
  
  const [mobile, setMobile] = useState('');
  
  const {mutate, isPending} = useSendOtpMutation();

  const handleLogin = () => {
    if (!mobile) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter mobile number',
      });
      return;
    }
    mutate({ mobile });
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
            <View style={{flex:1,justifyContent:"space-between",}}>
              <View style={{flex:1}}>
                <View style={styles.titleContainer}>
                  <ThemedText variant="title" style={styles.title}>Login</ThemedText>
                  <ThemedText variant="description" color="primary" style={styles.subtitle}>
                    Login with registered account
                  </ThemedText>
                </View>

                <ThemedTextInput
                  placeholder="Mobile Number"
                  placeholderTextColor={theme.placeholder}
                  value={mobile}
                  onChangeText={setMobile}
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  maxLength={10}
                />
              </View>

               <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: 'black' }]} 
                onPress={handleLogin}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ThemedText variant="text16B" color="background">Send OTP</ThemedText>
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
    gap: SPACING.space06,
  },
  inputContainer: {
      width: '100%',
  },
  input: {
    borderRadius: 50, // Pill shape
    height: moderateScale(56),
    paddingHorizontal: SPACING.space08,
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.space08,
    top: moderateScale(16), 
  },
  loginButton: {
    height: moderateScale(56),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.space08,
  },
});
