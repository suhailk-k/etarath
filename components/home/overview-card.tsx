import { moderateScale } from '@/newLib/responsive'
import { useTheme } from '@/newLib/theme'
import { ThemedText } from '@/newLib/ThemedText'
import { ThemedView } from '@/newLib/ThemedView'
import { SPACING } from '@/theme/spacing'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { memo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '../common/icon'

type OverviewCardProps = {
  onPress?: () => void
  total?: number
  pending?: number
  type: 'order' | 'product' | 'warranty'
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  onPress,
  total,
  pending,
    type,
}) => {
  const { theme } = useTheme()

  const iconName=()=>{
    switch(type){
      case 'order':
        return 'TabOrder'
      case 'product':
        return 'TabProduct'
      case 'warranty':
        return 'TabWarranty'
      default:
        return 'TabOrder'
    }
  }
  const title=()=>{
    switch(type){
      case 'order':
        return 'Assigned Orders'
      case 'product':
        return 'Stock-out Products'
      case 'warranty':
        return 'Assigned Warranty Requests'
      default:
        return ''
    }
  }
  const description=()=>{
    switch(type){
      case 'order':
        return 'Pending Orders'
      case 'product':
        return 'Limited Stocks'
      case 'warranty':
        return 'Return to collect'
      default:
        return ''
    }
  }


  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { borderColor: theme.primary }]}
      accessibilityRole="button"
    >
      <ThemedView
        style={styles.avatar}
        backgroundColor="backgroundSecondary"
      >
        <Icon name={iconName()} size={moderateScale(20)} iconFillColor="primary" />
      </ThemedView>

      <View style={styles.content}>
        <ThemedText variant="title" color="primary" style={styles.titleCount}>
          {total}
        </ThemedText>
        <ThemedText variant="subTitle" color="primary">
      {title()}
        </ThemedText>

        <View style={styles.pendingRow}>
          <ThemedText variant="description" color="error" style={styles.pendingCount}>
            {pending}
          </ThemedText>
          <ThemedText variant="description" color="primary">
        {description()}
          </ThemedText>
        </View>
      </View>

      <MaterialIcons
        name="keyboard-arrow-right"
        size={moderateScale(24)}
        color={theme.primary}
        style={styles.arrow}
      />
    </Pressable>
  )
}

export default memo(OverviewCard)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.gap,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
    marginHorizontal: SPACING.screenPadding,
    alignItems: 'center',
  },
  avatar: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(22.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.gap,
  },
  content: {
    flexShrink: 1,
  },
  titleCount: {
    marginBottom: moderateScale(4),
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(2),
  },
  pendingCount: {
    marginRight: moderateScale(6),
  },
  arrow: {
    marginLeft: 'auto',
  },
})