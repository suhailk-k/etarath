import { moderateScale } from '@/newLib/responsive'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface ButtonProps {
    title: string
    onPress: () => void
    loading?: boolean
    style?: ViewStyle | ViewStyle[]
    textStyle?: any
}

const Button = ({ title, onPress, loading = false, style, textStyle }: ButtonProps) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={loading ? undefined : onPress} 
            style={[styles.button, style, loading && styles.disabled]}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    disabled: {
        opacity: 0.7
    },
    text: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: '600'
    }
})
