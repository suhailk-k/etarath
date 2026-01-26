import { Device } from '@/newLib/device'
import { moderateScale } from '@/newLib/responsive'
import { useTheme } from '@/newLib/theme'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'
import { ScrollView, View } from 'react-native'

const OverviewCardSkeleton = () => {
    const { theme } = useTheme()
    const width = Device.width - (SPACING.screenPadding * 2)

    return (
        <View style={{
            borderWidth: moderateScale(1),
            borderColor: theme.backgroundSecondary,
            borderRadius: moderateScale(10),
            padding: SPACING.gap,
            marginHorizontal: SPACING.screenPadding,
            height: moderateScale(80),
            justifyContent: 'center'
        }}>
            <ContentLoader
                speed={1}
                width={width}
                height={moderateScale(46)}
                viewBox={`0 0 ${width} ${moderateScale(46)}`}
                backgroundColor={theme.backgroundSecondary}
                foregroundColor={theme.background}
            >
                {/* Avatar */}
                <Circle cx="23" cy="23" r="22.5" />
                
                {/* Title */}
                <Rect x="60" y="5" rx="4" ry="4" width="30" height="15" />
                <Rect x="60" y="25" rx="4" ry="4" width="120" height="14" />

                {/* Arrow */}
                <Rect x={width - 50} y="15" rx="4" ry="4" width="20" height="20" />
            </ContentLoader>
        </View>
    )
}

const HorizontalCardSkeleton = () => {
    const { theme } = useTheme()
    const width = Device.width * 0.8

    return (
        <View style={{
            borderWidth: moderateScale(1),
            borderColor: theme.backgroundSecondary,
            borderRadius: moderateScale(10),
            padding: SPACING.screenPadding,
            gap: moderateScale(10),
            width: width,
        }}>
            <ContentLoader
                speed={1}
                width={width} 
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

const SectionHeaderSkeleton = () => {
    const { theme } = useTheme()
    const width = Device.width - (SPACING.screenPadding * 2)
    return (
        <View style={{ marginHorizontal: SPACING.screenPadding, marginVertical: SPACING.gap }}>
            <ContentLoader
                 speed={1}
                 width={width}
                 height={20}
                 viewBox={`0 0 ${width} 20`}
                 backgroundColor={theme.backgroundSecondary}
                 foregroundColor={theme.background}
            >
                <Rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
                <Rect x={width - 60} y="0" rx="4" ry="4" width="60" height="20" />
            </ContentLoader>
        </View>
    )

}

const HomeSkeleton = () => {
    return (
        <ScrollView contentContainerStyle={{ paddingBottom: moderateScale(116), gap: SPACING.gap }}>
            {/* Overview Header */}
             <SectionHeaderSkeleton />

             {/* Overview Cards */}
             <View style={{ gap: SPACING.gap }}>
                 <OverviewCardSkeleton />
                 <OverviewCardSkeleton />
                 <OverviewCardSkeleton />
             </View>

            {/* Recent Orders */}
             <SectionHeaderSkeleton />
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.screenPadding, gap: SPACING.gap }}>
                <HorizontalCardSkeleton />
                <HorizontalCardSkeleton />
             </ScrollView>

             {/* Warranty Requests */}
             <SectionHeaderSkeleton />
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.screenPadding, gap: SPACING.gap }}>
                <HorizontalCardSkeleton />
                <HorizontalCardSkeleton />
             </ScrollView>
        </ScrollView>
    )
}

export default HomeSkeleton
