import React from "react"
import { TouchableOpacityProps } from "react-native"
import * as S from "./styles"

const icon = {
  positive: "arrow-up-circle",
  negative: "arrow-down-circle",
}

interface TransactionTypeButtonProps extends TouchableOpacityProps {
  title: string
  type: "positive" | "negative"
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
