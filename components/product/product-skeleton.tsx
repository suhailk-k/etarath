import { moderateScale } from '@/newLib/responsive'
import { useTheme } from '@/newLib/theme'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { View } from 'react-native'

const ProductSkeleton = () => {
    const { theme } = useTheme()
    return (
        <View style={{
            borderWidth: moderateScale(1),
            borderColor: theme.backgroundSecondary, // lighter border for skeleton
            borderRadius: moderateScale(10),
            padding: SPACING.screenPadding,
            flexDirection: 'row',
            gap: SPACING.gap,
            marginBottom: SPACING.gap,
        }}>
            {/* Image Container */}
            <ContentLoader
                speed={1}
                width={moderateScale(164)}
                height={moderateScale(217)}
                viewBox={`0 0 ${moderateScale(164)} ${moderateScale(217)}`}
                backgroundColor={theme.backgroundSecondary}
                foregroundColor={theme.background} // slightly lighter
            >
                <Rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
            </ContentLoader>

            {/* Details Container */}
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <ContentLoader
                    speed={1}
                    width={moderateScale(150)}
                    height={moderateScale(217)}
                    viewBox={`0 0 ${moderateScale(150)} ${moderateScale(217)}`}
                    backgroundColor={theme.backgroundSecondary}
                    foregroundColor={theme.background}
                >
                     {/* Badge */}
                    <Rect x="15" y="10" rx="12" ry="12" width="100" height="25" />
                    
                    {/* Brand */}
                    <Rect x="0" y="55" rx="4" ry="4" width="80" height="20" />
                    
                    {/* Name */}
                    <Rect x="0" y="85" rx="4" ry="4" width="140" height="20" />
                    <Rect x="0" y="110" rx="4" ry="4" width="100" height="20" />

                     {/* Size */}
                    <Rect x="0" y="145" rx="4" ry="4" width="40" height="12" />
                    <Rect x="0" y="160" rx="4" ry="4" width="80" height="16" />

                    {/* Updated At */}
                     <Rect x="0" y="185" rx="4" ry="4" width="60" height="12" />
                     <Rect x="0" y="200" rx="4" ry="4" width="80" height="15" />

                </ContentLoader>
            </View>
        </View>
    )
}

export default ProductSkeleton
