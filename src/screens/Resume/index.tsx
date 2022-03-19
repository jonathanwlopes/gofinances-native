import React, { useCallback, useEffect, useState } from "react"
import * as S from "./styles"
import { HistoryCard } from "../../components"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { categories } from "../../utils/categories"
import { VictoryPie } from "victory-native"
import { RFValue } from "react-native-responsive-fontsize"
import { useTheme } from "styled-components"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { addMonths, subMonths, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ActivityIndicator } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

interface TransactionData {
  type: "positive" | "negative"
  name: string
  amount: string
  category: string
  date: string
}

interface CategoryData {
  key: string
  name: string
  total: number
  totalFormatted: string
  color: string
  percent: string
}

export const Resume = () => {
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = "@gofinance:transactions"

    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === "negative" &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    )

    const expensiveTotal = expensives.reduce((acc: number, expensive: TransactionData) => {
      return acc + Number(expensive.amount)
    }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach((category) => {
      let categorySum = 0

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount)
        }
      })

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  )

  return (
    <S.Container>
      <S.Header>
        <S.Title>Resumo da categoria</S.Title>
      </S.Header>

      {isLoading ? (
        <S.LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </S.LoadContainer>
      ) : (
        <S.Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <S.MonthSelect>
            <S.MonthSelectButton onPress={() => handleChangeDate("prev")}>
              <S.MonthSelectIcon name="chevron-left" />
            </S.MonthSelectButton>

            <S.Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</S.Month>

            <S.MonthSelectButton onPress={() => handleChangeDate("next")}>
              <S.MonthSelectIcon name="chevron-right" />
            </S.MonthSelectButton>
          </S.MonthSelect>

          <S.ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="total"
              colorScale={totalByCategories.map((category) => category.color)}
              style={{ labels: { fontSize: RFValue(18), fontWeight: "bold", fill: theme.colors.shape } }}
              labelRadius={50}
            />
          </S.ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted} color={item.color} />
          ))}
        </S.Content>
      )}
    </S.Container>
  )
}
