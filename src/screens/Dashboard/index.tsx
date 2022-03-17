import React, { useCallback, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TransactionDataProps } from "../../components/TransactionCard/"
import { HighlightCard, TransactionCard } from "../../components"
import * as S from "./styles"
import { useFocusEffect } from "@react-navigation/native"

export interface DataListProps extends TransactionDataProps {
  id: string
}

export const Dashboard = () => {
  const [data, setData] = useState<DataListProps[]>([])


  async function loadTransactions() {
    const dataKey = "@gofinance:transactions"
    const response = await AsyncStorage.getItem(dataKey)

    const transactions = response ? JSON.parse(response) : []

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      const amount = Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      const newDate = item.date ? new Date(item.date) : new Date()
      const date = Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(newDate)

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    })

    setData(transactionsFormatted)
  }

  useEffect(() => {
    loadTransactions()
    // const dataKey = "@gofinance:transactions"
    // AsyncStorage.removeItem(dataKey)
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  },[]))


  return (
    <S.Container>
      <S.Header>
        <S.UserWrapper>
          <S.UserInfo>
            <S.Photo source={{ uri: "https://avatars.githubusercontent.com/u/65980571?v=4" }} />
            <S.User>
              <S.UserGreeting>Olá,</S.UserGreeting>
              <S.UserName>Jonathan</S.UserName>
            </S.User>
          </S.UserInfo>
          <S.PowerIcon name="power" />
        </S.UserWrapper>
      </S.Header>

      <S.HighlightCards>
        <HighlightCard title="Entradas" amount="R$ 17.400,00" lastTransaction="Última entrada dia 13 de abril" type="positive" />
        <HighlightCard title="Saídas" amount="R$ 1.259,00" lastTransaction="Última saída dia 03 de abril" type="negative" />
        <HighlightCard title="Total" amount="R$ 16.141,00" lastTransaction="01 à 16 de abril" type="total" />
      </S.HighlightCards>

      <S.Transactions>
        <S.Title>Listagem</S.Title>
        <S.TransactionList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <TransactionCard data={item} />} />
      </S.Transactions>
    </S.Container>
  )
}
