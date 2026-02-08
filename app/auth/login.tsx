import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import HeaderIcon from "@/assets/icons/header_icon.svg";
import { ThemedText } from "@/newLib/ThemedText";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme/hooks/useTheme";
import { useSendOtpMutation } from "@/services/queries/auth";
import { SPACING } from "@/theme/spacing";

export default function LoginScreen() {
  const { theme } = useTheme();

  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const { mutate, isPending } = useSendOtpMutation();

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setShowCountryPicker(false);
  };

  const handleLogin = () => {
    if (!mobile) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter mobile number",
      });
      return;
    }
    mutate({ mobile: `+${callingCode}${mobile}` });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <HeaderIcon width={150} height={50} />
            </View>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleContainer}>
                  <ThemedText variant="title" style={styles.title}>
                    Login
                  </ThemedText>
                  <ThemedText
                    variant="description"
                    color="primary"
                    style={styles.subtitle}
                  >
                    Login with registered account
                  </ThemedText>
                </View>

                {/* Phone Input with Country Picker */}
                <View
                  style={[
                    styles.phoneInputContainer,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.placeholder,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setShowCountryPicker(true)}
                    style={styles.countryPickerButton}
                  >
                    <CountryPicker
                      countryCode={countryCode}
                      withFilter
                      withFlag
                      withCallingCode
                      withEmoji
                      onSelect={handleCountrySelect}
                      visible={showCountryPicker}
                      onClose={() => setShowCountryPicker(false)}
                      containerButtonStyle={styles.countryPickerContainer}
                    />
                    <ThemedText
                      variant="text16B"
                      color="primary"
                      style={styles.callingCode}
                    >
                      +{callingCode}
                    </ThemedText>
                  </TouchableOpacity>

                  <View style={styles.separator} />

                  <TextInput
                    placeholder="Mobile Number"
                    placeholderTextColor={theme.placeholder}
                    value={mobile}
                    onChangeText={setMobile}
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    style={[styles.phoneInput, { color: theme.primary }]}
                    maxLength={10}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: "black" }]}
                onPress={handleLogin}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ThemedText variant="text16B" color="background">
                    Send OTP
                  </ThemedText>
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
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: SPACING.space11,
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    marginBottom: SPACING.space04,
  },
  subtitle: {
    textAlign: "center",
  },
  formContainer: {
    gap: SPACING.space06,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    height: moderateScale(56),
    paddingHorizontal: SPACING.space06,
    borderWidth: 1,
    width: "100%",
  },
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.space02,
  },
  countryPickerContainer: {
    marginRight: 0,
  },
  callingCode: {
    fontWeight: "600",
  },
  separator: {
    width: 1,
    height: moderateScale(24),
    backgroundColor: "#E0E0E0",
    marginHorizontal: SPACING.space04,
  },
  phoneInput: {
    flex: 1,
    fontWeight: "400" as const,
    fontSize: moderateScale(16),
    height: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    borderRadius: 50, // Pill shape
    height: moderateScale(56),
    paddingHorizontal: SPACING.space08,
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: SPACING.space08,
    top: moderateScale(16),
  },
  loginButton: {
    height: moderateScale(56),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.space08,
  },
});
