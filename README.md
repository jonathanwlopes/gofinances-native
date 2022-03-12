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

import { RFPercentage } from "react-native-responsive-fontsize"

export const Header = styled.View`
  width: 100%;
  height: ${RFPercentage(42)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`
```
