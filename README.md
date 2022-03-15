# Passo a passo

## Instalação de fontes

- Instalar a fonte pelo expo

```ts
expo install expo-font @expo-google-fonts/poppins
```

- Importar as fontes no projeto, e chamar as fontes.

```tsx
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins"

const [fontsLoaded] = useFonts({
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
})
```

- Aguardar carregamento das fontes

```ts
expo install expo-app-loading

  if (!fontsLoaded) {
    return <AppLoading />
  }

```

## Responsividade

- Biblioteca react native responsive font size, podemos fazer a ligação com a unidade de medida rem do desenvolvimento web.

```ts
yarn add react-native-responsive-fontsize

import { RFPercentage, RFValue } from "react-native-responsive-fontsize"

export const Header = styled.View`
  width: 100%;
  height: ${RFPercentage(42)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`

export const Photo = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;

  border-radius: 10px;
`
```

## Icons

- Biblioteca contendo diversos Icons

```ts
import { Feather } from "@expo/vector-icons"
;<Feather name="power" />
```

## Iphone espaçamento superior

- Utilizada a biblioteca iphone helper

```tsx
 yarn add react-native-iphone-x-helper

 import { getStatusBarHeight } from 'react-native-iphone-x-helper'

 export const UserWrapper = styled.View`
  width: 100%;
  padding: 0 24px;
  margin-top: ${getStatusBarHeight() + RFValue(28)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
```

## Buttons

- Botões configurados para que funcione tanto no android quanto no IOs

```ts
expo install react-native-gesture-handler

import { GestureHandlerRootView } from "react-native-gesture-handler"

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

```

## Fechar o teclado clicando em qualquer região da aplicação.

```ts
import { TouchableWithoutFeedback, Keyboard } from "react-native"
;<TouchableWithoutFeedback onPress={Keyboard.dismiss}>...</TouchableWithoutFeedback>
```

## Validação de formulário com Yup.

```ts
yarn add @hookform/resolvers yup

import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number().typeError("Informe um valor numérico").positive("O valor não pode ser negativo").required("O valor é obrigatório"),
})

export const Register = () => {
  ...
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  })
  ...
}
```
