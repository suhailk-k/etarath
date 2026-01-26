import { Device } from "@/newLib/device";
import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import { SPACING } from "@/theme/spacing";
import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const WarrantySkeleton = () => {
    const { theme } = useTheme();

    return (
        <View
            style={{
                borderWidth: moderateScale(1),
                borderColor: theme.primary,
                borderRadius: moderateScale(10),
                padding: SPACING.screenPadding,
                gap: moderateScale(10),
                width: "100%",
                backgroundColor: theme.background,
                overflow: 'hidden'
            }}
        >
            <ContentLoader
                speed={1}
                width={'100%'}
                height={moderateScale(150)} 
                viewBox={`0 0 ${Device.width - SPACING.screenPadding * 4} ${moderateScale(150)}`}
                backgroundColor={theme.backgroundSecondary}
                foregroundColor={theme.background}
            >
                {/* Status Badge */}
                <Rect x="0" y="0" rx={moderateScale(12.5)} ry={moderateScale(12.5)} width={moderateScale(100)} height={moderateScale(25)} />

                {/* Label and ID */}
                <Rect x="0" y={moderateScale(40)} rx="4" ry="4" width="40%" height={moderateScale(14)} />

                {/* Address/Location */}
                <Rect x="0" y={moderateScale(65)} rx="4" ry="4" width="80%" height={moderateScale(16)} />
                <Rect x="0" y={moderateScale(90)} rx="4" ry="4" width="60%" height={moderateScale(16)} />

                {/* Bottom Row: Customer & Date */}
                {/* Customer Label */}
                <Rect x="0" y={moderateScale(120)} rx="3" ry="3" width="20%" height={moderateScale(12)} />
                {/* Customer Value */}
                <Rect x="0" y={moderateScale(136)} rx="3" ry="3" width="30%" height={moderateScale(14)} />

                {/* Date Label */}
                <Rect x="50%" y={moderateScale(120)} rx="3" ry="3" width="20%" height={moderateScale(12)} />
                {/* Date Value */}
                <Rect x="50%" y={moderateScale(136)} rx="3" ry="3" width="30%" height={moderateScale(14)} />

            </ContentLoader>
        </View>
    );
};

export const WarrantySkeletonList = () => {
    return (
        <View style={{ gap: SPACING.gap, padding: SPACING.screenPadding, paddingTop: 0 }}>
             {[1, 2, 3, 4, 5].map((item) => (
                <WarrantySkeleton key={item} />
            ))}
        </View>
    )
}

export default WarrantySkeleton;
