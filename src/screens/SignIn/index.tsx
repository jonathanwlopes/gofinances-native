import React from "react"
import * as S from "./styles"
import { Alert } from "react-native"
import IconApple from "../../assets/apple.svg"
import IconGoogle from "../../assets/google.svg"
import IconLogo from "../../assets/logo.svg"
import { RFValue } from "react-native-responsive-fontsize"
import { SignInSocialButton } from "../../components"
import { useAuth } from "../../hooks/auth"

export const SignIn = () => {
  const { signInWithGoogle } = useAuth()

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle()
    } catch (e) {
      console.log(e)
      Alert.alert("Não foi possível conectar a conta Google")
    }
  }

  return (
    <S.Container>
      <S.Header>
        <S.TitleWrapper>
          <IconLogo width={RFValue(120)} height={RFValue(68)} />
          <S.Title>Controle suas finanças de forma mais simples</S.Title>
        </S.TitleWrapper>

        <S.SignInTitle>Faça seu login com uma das contas abaixo</S.SignInTitle>
      </S.Header>

      <S.Footer>
        <S.FooterWrapper>
          <SignInSocialButton title="Entrar com o google" svg={IconGoogle} onPress={handleSignInWithGoogle} />
          <SignInSocialButton title="Entrar com o apple" svg={IconApple} />
        </S.FooterWrapper>
      </S.Footer>
    </S.Container>
  )
}
