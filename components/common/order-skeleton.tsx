import { Device } from '@/newLib/device'
import { moderateScale } from '@/newLib/responsive'
import { useTheme } from '@/newLib/theme'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { View } from 'react-native'

const OrderSkeleton = () => {
    const { theme } = useTheme()
    const width = Device.width - (SPACING.screenPadding * 2)

    return (
        <View style={{
             borderWidth: moderateScale(1),
            borderColor: theme.backgroundSecondary,
            borderRadius: moderateScale(10),
            padding: SPACING.screenPadding,
            gap: moderateScale(10),
            width: "100%",
            marginBottom: SPACING.gap,
        }}>
            <ContentLoader
                speed={1}
                width={width} // approximate available width
                height={moderateScale(150)}
                viewBox={`0 0 ${width} ${moderateScale(150)}`}
                 backgroundColor={theme.backgroundSecondary}
                 foregroundColor={theme.background}
            >
                {/* Status Badge */}
                <Rect x="2" y="0" rx="12" ry="12" width="100" height="25" />

                {/* Order ID */}
                 <Rect x="2" y="35" rx="4" ry="4" width="150" height="14" />

                {/* Address */}
                <Rect x="2" y="55" rx="4" ry="4" width="90%" height="16" />
                
                {/* Place */}
                <Rect x="2" y="80" rx="4" ry="4" width="60%" height="16" />

                 {/* Row */}
                 {/* Customer */}
                 <Rect x="2" y="110" rx="4" ry="4" width="60" height="14" />
                 <Rect x="2" y="128" rx="4" ry="4" width="100" height="15" />

                 {/* Date */}
                 <Rect x="180" y="110" rx="4" ry="4" width="60" height="14" />
                 <Rect x="180" y="128" rx="4" ry="4" width="100" height="15" />

            </ContentLoader>
        </View>
    )
}

export default OrderSkeleton
