import { moderateScale } from '@/newLib/responsive';
import { useTheme } from '@/newLib/theme';
import { ThemedText } from '@/newLib/ThemedText';
import { ThemedView } from '@/newLib/ThemedView';
import { Product } from '@/services/api/types';
import { SPACING } from '@/theme/spacing';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ProductCard = ({ item }: { item: Product }) => {
   const {theme}=useTheme();
  return (
    <View style={{
        borderWidth:moderateScale(1),
        borderColor:theme.primary,
        borderRadius:moderateScale(10),
        padding:SPACING.screenPadding,
        flexDirection:'row',
        gap:SPACING.gap
    }}>
    <ThemedView style={{
       width: moderateScale(164),
       height: moderateScale(217),
       borderRadius: moderateScale(10),
       backgroundColor: theme.backgroundSecondary,
       alignItems: 'center',
       justifyContent: 'center'
    }}>
       <Image
        source={{ uri: item.productDetails.imageUrl?.[0] || 'https://via.placeholder.com/150' }}
        style={{
          width: moderateScale(120),
          height: moderateScale(120),
          borderRadius: moderateScale(10),
        }}
        contentFit="contain"
       />
    </ThemedView>
 <View style={{
    flex:1,
    justifyContent:'space-evenly',
    // gap:SPACING.gap
 }}>
       {item.status === 'Available' ? (
            <ThemedView
            style={{
                height: moderateScale(25),
                width: moderateScale(100),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: moderateScale(12.5),
                backgroundColor: theme.success,
             }}
          >
            <ThemedText color={"background"} variant="smallButtonText">
                 {"In Stock"}
            </ThemedText>
          </ThemedView>
       ) : (
        <ThemedView
           style={{
               height: moderateScale(25),
               width: moderateScale(100),
               alignItems: "center",
               justifyContent: "center",
               borderRadius: moderateScale(12.5),
               backgroundColor: theme.error,
            }}
         >
           <ThemedText color={"background"} variant="smallButtonText">
                {"Out of Stock"}
           </ThemedText>
         </ThemedView>
       )}
            <ThemedText variant="title" color="primary">{item.brandDetails?.name}</ThemedText>
         <ThemedText variant="text15B" numberOfLines={2}>{item.productDetails.productName}</ThemedText>
       <View style={{gap:moderateScale(4)}}><ThemedText variant="text12M">Size</ThemedText>
                  <ThemedText variant="text15B">{item.productDetails.size}</ThemedText>
                  </View>
        <View style={{gap:moderateScale(4)}}><ThemedText variant="text12M">Last Updated</ThemedText>
                  <ThemedText variant="text15B">{new Date(item.productDetails.updatedAt).toLocaleDateString()}</ThemedText>
</View>
 </View>
    </View>
  )
}

export default ProductCard

const styles = StyleSheet.create({})