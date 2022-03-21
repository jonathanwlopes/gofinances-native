import React from "react"
import * as S from "./styles"
import { GestureHandlerRootView, RectButtonProps } from "react-native-gesture-handler"
import { SvgProps } from "react-native-svg"
import { TouchableOpacityProps } from "react-native"

interface SignInSocialButtonProps extends TouchableOpacityProps {
  title: string
  svg: React.FC<SvgProps>
}

export const SignInSocialButton = ({ title, svg: Svg, ...rest }: SignInSocialButtonProps) => {
  return (
    <GestureHandlerRootView>
      <S.Button {...rest}>
        <S.ImageContainer>
          <Svg />
        </S.ImageContainer>

        <S.Text>{title}</S.Text>
      </S.Button>
    </GestureHandlerRootView>
  )
}
