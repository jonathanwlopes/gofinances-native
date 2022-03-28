import React, { useState } from "react"
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native"
import { useForm } from "react-hook-form"
import uuid from "react-native-uuid"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, CategorySelectButton, InputForm, TransactionTypeButton } from "../../components/Forms"
import { CategorySelect } from "../CategorySelect"
import * as S from "./styles"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../hooks/auth"
interface FormData {
  name: string
  amount: string
}

type NavigationProps = {
  navigate: (screen: string) => void
}

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number().typeError("Informe um valor numérico").positive("O valor não pode ser negativo").required("O valor é obrigatório"),
})

export const Register = () => {
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  })

  const [transactionType, setTransactionType] = useState("")
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const navigation = useNavigation<NavigationProps>()

  const { user } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleTransactionTypeSelect = (type: "positive" | "negative") => {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação")
    if (category.key === "category") return Alert.alert("Selecione a categoria")

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = `@gofinance:transactions_user:${user.id}`

      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []
      const dataFormatted = [...currentData, newTransaction]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      setTransactionType("")
      setCategory({
        key: "category",
        name: "Categoria",
      })
      reset()

      navigation.navigate("Listagem")
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <S.Container>
        <S.Header>
          <S.Title>Cadastro</S.Title>
        </S.Header>

        <S.Form>
          <S.Fields>
            <InputForm
              name="name"
              placeholder="Nome"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm name="amount" placeholder="Preço" control={control} keyboardType="numeric" error={errors.amount && errors.amount.message} />

            <S.TransactionsTypes>
              <TransactionTypeButton title="Income" type="positive" onPress={() => handleTransactionTypeSelect("positive")} isActive={transactionType === "positive"} />

              <TransactionTypeButton
                title="Outcome"
                type="negative"
                onPress={() => handleTransactionTypeSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </S.TransactionsTypes>

            <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />
          </S.Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </S.Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect category={category} setCategory={setCategory} closeSelectCategory={handleCloseSelectCategoryModal} />
        </Modal>
      </S.Container>
    </TouchableWithoutFeedback>
  )
}
