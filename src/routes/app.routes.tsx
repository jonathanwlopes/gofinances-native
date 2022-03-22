import React from "react"
import { Platform } from "react-native"
import { useTheme } from "styled-components"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Dashboard, Register, Resume } from "../screens"
import { MaterialIcons } from "@expo/vector-icons"

export const AppRoutes = () => {
  const { Navigator, Screen } = createBottomTabNavigator()
  const theme = useTheme()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height: 88,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{ tabBarIcon: ({ size, color }) => <MaterialIcons name="format-list-bulleted" size={size} color={color} /> }}
      />
      <Screen
        name="Registro"
        component={Register}
        options={{ tabBarIcon: ({ size, color }) => <MaterialIcons name="attach-money" size={size} color={color} /> }}
      />
      <Screen
        name="Resume"
        component={Resume}
        options={{ tabBarIcon: ({ size, color }) => <MaterialIcons name="pie-chart" size={size} color={color} /> }}
      />
    </Navigator>
  )
}
