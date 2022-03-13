import React from "react"
import { TouchableOpacityProps } from "react-native"
import * as S from "./styles"

const icon = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
}

interface TransactionTypeButtonProps extends TouchableOpacityProps {
  title: string
  type: "up" | "down"
  isActive: boolean
}

export const TransactionTypeButton = ({ title, type, isActive, ...rest }: TransactionTypeButtonProps) => {
  return (
    <S.Container {...rest} isActive={isActive} type={type}>
      <S.Icon name={icon[type]} type={type} />
      <S.Title>{title}</S.Title>
    </S.Container>
  )
}
