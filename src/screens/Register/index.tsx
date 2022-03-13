import React, { useState } from "react"
import { Button, Input, TransactionTypeButton } from "../../components/Forms"

import * as S from "./styles"

export const Register = () => {
  const [transactionType, setTransactionType] = useState("")

  const handleTransactionTypeSelect = (type: "up" | "down") => {
    setTransactionType(type)
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>Cadastro</S.Title>
      </S.Header>

      <S.Form>
        <S.Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />

          <S.TransactionsTypes>
            <TransactionTypeButton title="Income" type="up" onPress={() => handleTransactionTypeSelect("up")} isActive={transactionType === "up"} />

            <TransactionTypeButton
              title="Outcome"
              type="down"
              onPress={() => handleTransactionTypeSelect("down")}
              isActive={transactionType === "down"}
            />
          </S.TransactionsTypes>
        </S.Fields>

        <Button title="Enviar" />
      </S.Form>
    </S.Container>
  )
}
