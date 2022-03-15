import React, { useState } from "react"
import { Modal } from "react-native"

import { Button, CategorySelectButton, Input, TransactionTypeButton } from "../../components/Forms"
import { CategorySelect } from "../CategorySelect"
import * as S from "./styles"

export const Register = () => {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  })
  const [transactionType, setTransactionType] = useState("")
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const handleTransactionTypeSelect = (type: "up" | "down") => {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
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

          <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />
        </S.Fields>

        <Button title="Enviar" />
      </S.Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect category={category} setCategory={setCategory} closeSelectCategory={handleCloseSelectCategoryModal} />
      </Modal>
    </S.Container>
  )
}
