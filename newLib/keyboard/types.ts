import { ViewProps } from 'react-native';
import { KeyboardAvoidingViewProps } from 'react-native-keyboard-controller';

export interface DismissKeyboardViewProps extends ViewProps {
  children: React.ReactNode;
  /**
   * Whether to disable keyboard dismissal
   * @default false
   */
  disabled?: boolean;
}

export interface KeyboardAwareViewProps extends Omit<KeyboardAvoidingViewProps, 'behavior'> {
  children: React.ReactNode;
  /**
   * Additional offset to apply to the keyboard height
   * @default 0
   */
  keyboardOffset?: number;
  /**
   * Whether to disable keyboard avoiding behavior
   * @default false
   */
  disabled?: boolean;
}
