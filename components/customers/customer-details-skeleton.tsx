import { Device } from '@/newLib/device'
import { useTheme } from '@/newLib/theme'
import { SPACING } from '@/theme/spacing'
import React from 'react'
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'
import { StyleSheet, View } from 'react-native'

const CustomerDetailsSkeleton = () => {
    const { theme } = useTheme()
    const screenWidth = Device.width

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Banner Skeleton */}
            <ContentLoader
                speed={1}
                width={screenWidth}
                height={150}
                viewBox={`0 0 ${screenWidth} 150`}
                backgroundColor={theme.backgroundSecondary}
                foregroundColor={theme.background}
            >
                <Rect x="0" y="0" rx="0" ry="0" width={screenWidth} height="150" />
            </ContentLoader>

            {/* Profile Section Skeleton */}
            <View style={[styles.profileSection, { backgroundColor: theme.background }]}>
                 {/* Logo Circle */}
                 <View style={styles.logoContainer}>
                    <ContentLoader
                        speed={1}
                        width={84}
                        height={84}
                        viewBox="0 0 84 84"
                        backgroundColor={theme.backgroundSecondary}
                        foregroundColor={theme.background}
                        style={{marginTop: -42}}
                    >
                        <Circle cx="42" cy="42" r="40" />
                    </ContentLoader>
                 </View>

                 {/* Name & Title */}
                 <View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
                    <ContentLoader
                        speed={1}
                        width={200}
                        height={50}
                        viewBox="0 0 200 50"
                        backgroundColor={theme.backgroundSecondary}
                        foregroundColor={theme.background}
                    >
                        <Rect x="25" y="0" rx="4" ry="4" width="150" height="20" />
                        <Rect x="50" y="30" rx="4" ry="4" width="100" height="14" />
                    </ContentLoader>
                 </View>

                 {/* Stats */}
                 <View style={styles.statsContainer}>
                    <ContentLoader
                        speed={1}
                        width={screenWidth - 40}
                        height={60}
                        viewBox={`0 0 ${screenWidth - 40} 60`}
                        backgroundColor={theme.backgroundSecondary}
                        foregroundColor={theme.background}
                    >
                        {/* Stat 1 */}
                        <Circle cx="40" cy="30" r="20" />
                        <Rect x="70" y="15" rx="4" ry="4" width="60" height="12" />
                        <Rect x="70" y="35" rx="4" ry="4" width="30" height="16" />

                        <Rect x={(screenWidth - 40)/2} y="10" rx="0" ry="0" width="1" height="40" />
                        
                        {/* Stat 2 */}
                        <Circle cx={(screenWidth - 40)/2 + 40} cy="30" r="20" />
                        <Rect x={(screenWidth - 40)/2 + 70} y="15" rx="4" ry="4" width="60" height="12" />
                        <Rect x={(screenWidth - 40)/2 + 70} y="35" rx="4" ry="4" width="30" height="16" />
                    </ContentLoader>
                 </View>
            </View>

            {/* Info Card Skeleton */}
            <View style={[styles.infoCard, { borderColor: theme.backgroundSecondary, marginTop: 140 }]}>
                <ContentLoader
                    speed={1}
                    width={screenWidth - SPACING.screenPadding * 2 - 32} // padding included
                    height={160}
                    viewBox={`0 0 ${screenWidth - SPACING.screenPadding * 2 - 32} 160`}
                    backgroundColor={theme.backgroundSecondary}
                    foregroundColor={theme.background}
                >
                    <Rect x="0" y="10" rx="4" ry="4" width="100%" height="20" />
                    <Rect x="0" y="50" rx="4" ry="4" width="100%" height="20" />
                    <Rect x="0" y="90" rx="4" ry="4" width="100%" height="20" />
                    <Rect x="0" y="130" rx="4" ry="4" width="100%" height="20" />
                </ContentLoader>
            </View>

             {/* Button Skeleton */}
             <View style={{ marginHorizontal: SPACING.screenPadding, marginTop: 20 }}>
                <ContentLoader
                    speed={1}
                    width={screenWidth - SPACING.screenPadding * 2}
                    height={50}
                    viewBox={`0 0 ${screenWidth - SPACING.screenPadding * 2} 50`}
                    backgroundColor={theme.backgroundSecondary}
                    foregroundColor={theme.background}
                >
                    <Rect x="0" y="0" rx="25" ry="25" width="100%" height="50" />
                </ContentLoader>
             </View>

        </View>
    )
}

export default CustomerDetailsSkeleton

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileSection: {
        position: 'absolute',
        top: 100,
        left: SPACING.screenPadding,
        right: SPACING.screenPadding,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    logoContainer: {
        position: 'absolute',
        top: -40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    infoCard: {
        marginHorizontal: SPACING.screenPadding,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
})
