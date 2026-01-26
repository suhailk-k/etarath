import Button from '@/components/common/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { moderateScale } from '@/newLib/responsive';
import { UpdateProfilePayload } from '@/services/api/types/user';
import { userApi } from '@/services/api/user';
import { SPACING } from '@/theme/spacing';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
interface UpdateProfileSheetProps {
    user: any;
}

const UpdateProfileSheet = forwardRef<BottomSheetModal, UpdateProfileSheetProps>(({ user }, ref) => {
    const queryClient = useQueryClient();
    
    // State for form fields
    const [fullName, setFullName] = useState(user?.userName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [imgUrl, setImgUrl] = useState(user?.imgUrl || '');

    React.useEffect(() => {
        if (user) {
            setFullName(user.userName || '');
            setEmail(user.email || '');
            setImgUrl(user.imgUrl || '');
        }
    }, [user]);

    const snapPoints = useMemo(() => ['50%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfilePayload) => userApi.updateProfile(data),
        onSuccess: async () => {
            Alert.alert("Success", "Profile updated successfully");
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            (ref as any).current?.dismiss();
        },
        onError: (error: any) => {
            console.error("Profile update error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
        }
    });

    const handleUpdate = () => {
        const payload: UpdateProfilePayload = {
            userName: fullName,
            email: email,
            imgUrl: imgUrl,
        };

        updateProfileMutation.mutate(payload);
    };

    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.header}>
                    <ThemedText type="defaultSemiBold" style={styles.title}>Update Profile</ThemedText>
                </View>

                <View style={styles.formContainer}>
                    <ThemedTextInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        label="Full Name"
                    />
                    <ThemedTextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Update"
                        onPress={handleUpdate}
                        loading={updateProfileMutation.isPending}
                    />
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: SPACING.screenPadding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    title: {
        fontSize: moderateScale(18),
    },
    formContainer: {
        gap: moderateScale(16),
    },
    footer: {
        marginTop: moderateScale(30),
    }
});

export default UpdateProfileSheet;
