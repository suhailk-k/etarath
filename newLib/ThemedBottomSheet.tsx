import { Device } from '@/lib/expo-app-modules/device';
import { ThemeColors } from '@/theme/colors';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'expo-app-modules/responsive-dimensions';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from './theme/hooks/useTheme';

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoint?: (string | number)[];
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  handleIndicatorStyle?: ViewStyle;
  onDismiss?: () => void;
  backgroundColor?: keyof ThemeColors;
  backdropColor?: keyof ThemeColors;
  handleIndicatorColor?: keyof ThemeColors;
  enableBackHandling?: boolean;
}

const ThemedBottomSheet = React.forwardRef<BottomSheetModalMethods, BottomSheetProps>(
  (props, ref) => {
    const {
      children,
      enablePanDownToClose = true,
      handleIndicatorStyle,
      snapPoint,
      onDismiss,
      backgroundColor = 'background',
      handleIndicatorColor = 'border',
      enableBackHandling = true,
    } = props;

    const { theme } = useTheme();
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const dismissing = useRef(false);

    const renderBackdrop = useCallback(
      (params: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={1}
          pressBehavior="close"
          {...params}
          style={[styles.backdrop, { backgroundColor: theme.primaryOverlay }]}
        />
      ),
      [theme]
    );

    const snapPoints = useMemo(() => snapPoint, [snapPoint]);

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      mass: 0.3,
      stiffness: 350,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
      duration: 250,
    });

    // Enhanced back handler with navigation integration
    const handleBackPress = useCallback(() => {
      if (isVisible && !dismissing.current) {
        dismissing.current = true;
        (ref as React.RefObject<BottomSheetModalMethods>)?.current?.dismiss();
        return true;
      }
      return false;
    }, [isVisible, ref]);

    // Navigation and back handler effects
    useEffect(() => {
      if (enableBackHandling) {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
          if (isVisible) {
            // Prevent navigation while bottom sheet is open
            e.preventDefault();
            handleBackPress();
          }
        });

        return () => {
          backHandler.remove();
          unsubscribe();
        };
      }
    }, [handleBackPress, isVisible, navigation, enableBackHandling]);

    const handleSheetChanges = useCallback((index: number) => {
      const newVisible = index >= 0;
      setIsVisible(newVisible);
      if (!newVisible) {
        dismissing.current = false;
      }
    }, []);

    const handleDismiss = useCallback(() => {
      setIsVisible(false);
      dismissing.current = false;
      onDismiss?.();
    }, [onDismiss]);

    return (
      <BottomSheetModal
        maxDynamicContentSize={Device.height * 0.8}
        onDismiss={handleDismiss}
        onChange={handleSheetChanges}
        animationConfigs={animationConfigs}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.modalBackground, { backgroundColor: theme[backgroundColor] }]}
        enableDynamicSizing={!snapPoints}
        enableOverDrag={true}
        enablePanDownToClose={enablePanDownToClose}
        snapPoints={snapPoints}
        // {...(!handleIndicatorStyle && { handleComponent: () => null })}
        handleIndicatorStyle={[
          styles.handleIndicator,
          { backgroundColor: theme[handleIndicatorColor] },
          handleIndicatorStyle,
        ]}
        index={0}
        ref={ref}
        style={[styles.modal, { backgroundColor: theme[backgroundColor] }]}>
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ThemedBottomSheet.displayName = 'ThemedBottomSheet';

export default React.memo(ThemedBottomSheet);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  handleIndicator: {
    width: moderateScale(32),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
  },
  modal: {
    backgroundColor: '#000',
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 3,
  },
  modalBackground: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
});
