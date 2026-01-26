import { moderateScale } from '@/newLib/responsive'
import { useTheme } from '@/newLib/theme'
import { ThemedText } from '@/newLib/ThemedText'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

type Props = {
  title?: string
  buttonName?: string
  onPress?: () => void
  containerStyle?: StyleProp<ViewStyle>
}

const SectionHeader: React.FC<Props> = ({ title = '', buttonName, onPress, containerStyle }) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.row, containerStyle, { paddingHorizontal: SPACING.screenPadding }]}>
      <ThemedText variant="title" color="primary">
        {title}
      </ThemedText>

      {buttonName ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <ThemedText color="background" variant="smallButtonText">
            {buttonName}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  )
}

export default SectionHeader

const styles = StyleSheet.create<{ row: ViewStyle; button: ViewStyle }>({
  row: {
    marginTop: moderateScale(20),
    marginBottom: SPACING.gap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: moderateScale(30),
    minWidth: moderateScale(85),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
  },
})