import Button from '@/components/common/button'
import Header from '@/components/common/header'
import ImageUploader from '@/components/common/image-uploader'
import { moderateScale } from '@/newLib/responsive'
import { ClaimStatus } from '@/services/api/types/claim'
import { useClaimDetails, useDropClaim, usePickupClaim, useUpdateClaimStatus } from '@/services/queries/claims'
import { SPACING } from '@/theme/spacing'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

const ClaimDetails = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const { data: claim, isLoading } = useClaimDetails(id as string)
    const { mutate: pickupClaim, isPending: isPickupPending } = usePickupClaim()
    const { mutate: dropClaim, isPending: isDropPending } = useDropClaim()
    const { mutate: updateClaimStatus, isPending: isUpdatePending } = useUpdateClaimStatus()

    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        status: '' as ClaimStatus,
        checkingRemarks: '',
        balanceThreshold: '',
        officialImgs: {
            fullTyrePicture: '',
            brandName: '',
            seriaNo: '',
            dOT: '',
            pattern: ''
        },
        defectiveImgs: {
            tyreTread: '',
            defectPicture1: '',
            defectPicture2: '',
            innerlinePicture: '',
            treadDept1: '',
            treadDept2: '',
            treadDept3: '',
            treadDept4: ''
        }
    })

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="black" />
            </View>
        )
    }

    if (!claim) {
        return (
            <View style={styles.center}>
                <Text>Claim not found</Text>
            </View>
        )
    }

    const handlePickup = () => {
        pickupClaim(id as string, {
            onSuccess: () => {
                Alert.alert("Success", "Claim picked up successfully")
            },
            onError: (error: any) => {
                Alert.alert("Error", error.message || "Failed to pickup claim")
            }
        })
    }

    const handleDrop = () => {
        dropClaim(id as string, {
            onSuccess: () => {
                Alert.alert("Success", "Claim dropped successfully")
            },
            onError: (error: any) => {
                Alert.alert("Error", error.message || "Failed to drop claim")
            }
        })
    }

    const handleUpdate = () => {
        const payload = {
            status: updateForm.status,
            checkingRemarks: updateForm.checkingRemarks,
            balanceThreshold: Number(updateForm.balanceThreshold),
            salesAgentAttchedOfficialImgs: updateForm.officialImgs,
            salesAgentAttchedDefectiveImgs: updateForm.defectiveImgs
        }

        updateClaimStatus({ id: id as string, data: payload }, {
            onSuccess: () => {
                Alert.alert("Success", "Claim updated successfully")
                setIsUpdateModalVisible(false)
            },
            onError: (error: any) => {
                Alert.alert("Error", error.message || "Failed to update claim")
            }
        })
    }

    const DetailRow = ({ label, value, isStatus = false }: { label: string, value: string | number, isStatus?: boolean }) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={[
                styles.value,
                isStatus && { color: getStatusColor(value as string) }
            ]}>
                {value}
            </Text>
        </View>
    )

    const getStatusColor = (status: string) => {
        if (!status) return 'black';
        switch (status.toLowerCase()) {
            case 'pending': return 'orange';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            case 'approved': return 'blue';
            case 'in-progress': return 'blue';
            case 'rejected': return 'red';
            default: return 'black';
        }
    }

    const renderActionButtons = () => {
        const agentStatus = claim.agentStatus;

        if (agentStatus === 'new' || !agentStatus) { // Assuming 'new' or null means unassigned
            return (
                <Button
                    title="Pickup Claim"
                    onPress={handlePickup}
                    loading={isPickupPending}
                    style={styles.actionButton}
                />
            )
        }

        if (agentStatus === 'assigned') {
            return (
                <View style={styles.buttonGroup}>
                    <Button
                        title="Update Status"
                        onPress={() => setIsUpdateModalVisible(true)}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Drop Claim"
                        onPress={handleDrop}
                        loading={isDropPending}
                        style={[styles.actionButton, styles.dropButton]}
                    />
                </View>
            )
        }
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header title="Claim Details" showBack={true} onBackPress={() => router.back()} />
            <ScrollView contentContainerStyle={{ padding: SPACING.screenPadding, paddingBottom: 100 }}>
                <View style={styles.card}>
                    <DetailRow label="Claim ID" value={claim.claimId} />
                    <DetailRow label="Order ID" value={claim.orderDetails?.orderId || "N/A"} />
                    <DetailRow label="Date" value={new Date(claim.createdAt).toLocaleDateString()} />
                    <DetailRow label="Customer" value={claim.userDetails?.userName || "N/A"} />
                    <DetailRow label="Reason" value={claim.reason} />
                    <DetailRow label="Quantity" value={claim.claimProductQuantity} />
                    <DetailRow label="Status" value={claim.status} isStatus />
                    {claim.agentStatus && <DetailRow label="Agent Status" value={claim.agentStatus} />}
                </View>
                
                <View style={{ marginTop: 20 }}>
                    {renderActionButtons()}
                </View>
            </ScrollView>

            <Modal
                visible={isUpdateModalVisible}
                animationType="slide"
                onRequestClose={() => setIsUpdateModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Header title="Update Claim" showBack={true} onBackPress={() => setIsUpdateModalVisible(false)} />
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.sectionTitle}>Status</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Status (e.g. approved, rejected)"
                            value={updateForm.status}
                            onChangeText={(text) => setUpdateForm({ ...updateForm, status: text as ClaimStatus })}
                        />

                        <Text style={styles.sectionTitle}>Remarks</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Checking Remarks"
                            value={updateForm.checkingRemarks}
                            onChangeText={(text) => setUpdateForm({ ...updateForm, checkingRemarks: text })}
                            multiline
                        />
                        
                        <Text style={styles.sectionTitle}>Balance Threshold</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Balance Threshold"
                            value={updateForm.balanceThreshold}
                            onChangeText={(text) => setUpdateForm({ ...updateForm, balanceThreshold: text })}
                            keyboardType="numeric"
                        />

                        <Text style={styles.sectionTitle}>Official Images</Text>
                        <View style={styles.imageGrid}>
                            {Object.keys(updateForm.officialImgs).map((key) => (
                                <ImageUploader
                                    key={key}
                                    label={key.replace(/([A-Z])/g, ' $1').trim()} // Format camelCase to Title Case
                                    value={(updateForm.officialImgs as any)[key]}
                                    onUpload={(url) => setUpdateForm(prev => ({
                                        ...prev,
                                        officialImgs: { ...prev.officialImgs, [key]: url }
                                    }))}
                                    containerStyle={styles.imageUploader}
                                />
                            ))}
                        </View>

                        <Text style={styles.sectionTitle}>Defective Images</Text>
                        <View style={styles.imageGrid}>
                             {Object.keys(updateForm.defectiveImgs).map((key) => (
                                <ImageUploader
                                    key={key}
                                    label={key.replace(/([A-Z])/g, ' $1').trim()}
                                    value={(updateForm.defectiveImgs as any)[key]}
                                    onUpload={(url) => setUpdateForm(prev => ({
                                        ...prev,
                                        defectiveImgs: { ...prev.defectiveImgs, [key]: url }
                                    }))}
                                    containerStyle={styles.imageUploader}
                                />
                            ))}
                        </View>

                        <Button
                            title="Submit Update"
                            onPress={handleUpdate}
                            loading={isUpdatePending}
                            style={{ marginTop: 20 }}
                        />
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

export default ClaimDetails

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    card: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        gap: moderateScale(15)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: moderateScale(5)
    },
    label: {
        fontSize: moderateScale(14),
        color: '#666',
        minWidth: moderateScale(100)
    },
    value: {
        fontSize: moderateScale(14),
        fontWeight: '500', 
        color: '#000',
        flex: 1
    },
    buttonGroup: {
        flexDirection: 'column',
        gap: 10
    },
    actionButton: {
        width: '100%'
    },
    dropButton: {
        backgroundColor: '#FF6B6B' // Reddish for drop
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    modalContent: {
        padding: 20,
        paddingBottom: 100
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    imageUploader: {
        width: '48%'
    }
})
