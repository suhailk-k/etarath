import Back from "@/assets/icons/back.svg";
import Chart from "@/assets/icons/chart.svg";
import ChevronRight from "@/assets/icons/chevron-right.svg";
import Edit from "@/assets/icons/edit.svg";
import HeaderIcon from "@/assets/icons/header_icon.svg";
import Info from "@/assets/icons/info.svg";
import Logout from "@/assets/icons/logout.svg";
import Phone from "@/assets/icons/phone.svg";
import Profile from "@/assets/icons/profile.svg";
import Search from "@/assets/icons/search.svg";
import TabHome from "@/assets/icons/tab/home.svg";
import TabOrder from "@/assets/icons/tab/order.svg";
import TabProduct from "@/assets/icons/tab/product.svg";
import TabProfile from "@/assets/icons/tab/profile.svg";
import TabWarranty from "@/assets/icons/tab/warranty.svg";
import Users from "@/assets/icons/users.svg";

import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { moderateScale } from "@/newLib/responsive";
import { useTheme } from "@/newLib/theme";
import type { ThemeColors } from "@/theme/colors";

const icons = {
  Profile,
  TabHome,
  TabOrder,
  TabProduct,
  TabWarranty,
  TabProfile,
  HeaderIcon,
  Search,
  Back,
  Edit,
  Chart,
  Users,
  Phone,
  Info,
  Logout,
  ChevronRight,
};

export type iconNameType = keyof typeof icons;
export type IconColorType = keyof ThemeColors;

type PropsType = React.PropsWithChildren<{
  color?: IconColorType;
  name: iconNameType;
  size?: number;
  iconStrokeColor?: IconColorType;
  iconFillColor?: IconColorType;
  style?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  height?: number;
  width?: number;
}>;

const Icon = (props: PropsType): React.JSX.Element => {
  const { theme } = useTheme();
  const {
    backgroundStyle,
    color,
    iconFillColor,
    iconStrokeColor,
    name,
    size,
    style,
    height,
    width,
  } = props;
  const Icon = icons[name];

  return (
    <View style={backgroundStyle}>
      <Icon
        color={color ? theme[color] : "none"}
        fill={iconFillColor ? theme[iconFillColor] : "none"}
        height={size ?? height ?? moderateScale(24)}
        stroke={iconStrokeColor ? theme[iconStrokeColor] : "none"}
        style={style}
        width={size ?? width ?? moderateScale(24)}
      />
    </View>
  );
};

export default Icon;
