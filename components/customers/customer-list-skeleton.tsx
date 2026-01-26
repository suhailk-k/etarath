import { Device } from '@/newLib/device'
import { useTheme } from '@/newLib/theme'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { StyleSheet, View } from 'react-native'

const CardSkeleton = () => {
    const { theme } = useTheme()
    const screenWidth = Device.width
    const cardWidth = screenWidth - (SPACING.screenPadding * 2)

    return (
        <View style={styles.card}>
            <ContentLoader
                speed={1}
                width={cardWidth}
                height={180}
                viewBox={`0 0 ${cardWidth} 180`}
                backgroundColor={theme.backgroundSecondary}
                foregroundColor={theme.background}
            >
                <Rect x="0" y="0" rx="12" ry="12" width={cardWidth} height="180" />
            </ContentLoader>
        </View>
    )
}

const CustomerListSkeleton = () => {
    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </View>
    )
}

export default CustomerListSkeleton

const styles = StyleSheet.create({
    container: {
        padding: SPACING.screenPadding,
        gap: SPACING.gap,
    },
    card: {
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
    }
})
