import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TransactionDataProps } from "../../components/TransactionCard/"
import { HighlightCard, TransactionCard } from "../../components"
import * as S from "./styles"
import { useFocusEffect } from "@react-navigation/native"
import { useTheme } from "styled-components"
import { useAuth } from "../../hooks/auth"
export interface DataListProps extends TransactionDataProps {
  id: string
}

interface HighlightProps {
  amount: string
  lastTransaction: string
}
interface HighlightDataProps {
  entries: HighlightProps
  expensives: HighlightProps
  total: HighlightProps
}

export const Dashboard = () => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightDataProps>({} as HighlightDataProps)
  const { SignOut, user } = useAuth()

  let entriesTotal = 0
  let expensiveTotal = 0

  function getLastTransaction(collection: DataListProps[], type: "positive" | "negative") {
    const collectionFiltered = collection.filter((transaction) => transaction.type === type)

    console.log(collectionFiltered)
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction) => new Date(transaction.date).getTime())
      )
    )

    if (collectionFiltered.length === 0) return 0

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString("pt-BR", { month: "long" })}`
  }

  async function loadTransactions() {
    const dataKey = `@gofinance:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)

    const transactions = response ? JSON.parse(response) : []

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if (item.type === "positive") {
        entriesTotal += Number(item.amount)
      }

      if (item.type === "negative") {
        expensiveTotal += Number(item.amount)
      }

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

    setTransactions(transactionsFormatted)
    const lastTransactionEntries = getLastTransaction(transactions, "positive")
    const lastTransactionExpensive = getLastTransaction(transactions, "negative")
    const totalInterval = lastTransactionExpensive === 0 ? "Não há transações" : `01 à ${lastTransactionExpensive}`
    const total = entriesTotal - expensiveTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lastTransaction: lastTransactionEntries === 0 ? "Não há transações" : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lastTransaction: lastTransactionExpensive === 0 ? "Não há transações" : `Última saída dia ${lastTransactionExpensive}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        lastTransaction: totalInterval,
      },
    })

    entriesTotal = 0
    expensiveTotal = 0

    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <S.Container>
      {isLoading ? (
        <S.LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </S.LoadContainer>
      ) : (
        <>
          <S.Header>
            <S.UserWrapper>
              <S.UserInfo>
                <S.Photo source={{ uri: user.photo }} />
                <S.User>
                  <S.UserGreeting>Olá,</S.UserGreeting>
                  <S.UserName>{user.name}</S.UserName>
                </S.User>
              </S.UserInfo>
              <S.LogoutButton onPress={SignOut}>
                <S.PowerIcon name="power" />
              </S.LogoutButton>
            </S.UserWrapper>
          </S.Header>

          <S.HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="positive"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="negative"
            />
            <HighlightCard title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction} type="total" />
          </S.HighlightCards>

          <S.Transactions>
            <S.Title>Listagem</S.Title>
            <S.TransactionList data={transactions} keyExtractor={(item) => item.id} renderItem={({ item }) => <TransactionCard data={item} />} />
          </S.Transactions>
        </>
      )}
    </S.Container>
  )
}
