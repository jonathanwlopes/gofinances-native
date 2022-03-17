import React from "react"
import * as S from "./styles"

interface HighlightCardProps {
  type: "positive" | "negative" | "total"
  title: string
  amount: string
  lastTransaction: string
}

export const HighlightCard = ({ title, amount, lastTransaction, type }: HighlightCardProps) => {
  const icon = {
    positive: "arrow-up-circle",
    negative: "arrow-down-circle",
    total: "dollar-sign",
  }

  return (
    <S.Container type={type}>
      <S.Header>
        <S.Title type={type}>{title}</S.Title>
        <S.Arrow name={icon[type]} type={type} />
      </S.Header>
      <S.Footer>
        <S.Amount type={type}>{amount}</S.Amount>
        <S.LastTransaction type={type}>{lastTransaction}</S.LastTransaction>
      </S.Footer>
    </S.Container>
  )
}
