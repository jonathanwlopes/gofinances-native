import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as AuthSession from "expo-auth-session"

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  name: string
  email: string
  photo?: string
}
interface AuthContextData {
  user: User
  signInWithGoogle: () => Promise<void>
  SignOut: () => Promise<void>
  userStorageLoading: boolean
}

interface AuthorizationResponse {
  params: {
    access_token: string
  }
  type: string
}

const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dataKey = "@gofinance:user"

  const [user, setUser] = useState<User>({} as User)
  const [userStorageLoading, setUserStorageLoading] = useState(true)

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token"
      const SCOPE = encodeURI("profile email")

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

      const { params, type } = (await AuthSession.startAsync({ authUrl })) as AuthorizationResponse

      if (type === "success") {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json()

        const userLogged: User = {
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
        }

        setUser(userLogged)
        await AsyncStorage.setItem(dataKey, JSON.stringify(userLogged))
      }
    } catch (e) {
      throw new Error(e as string)
    }
  }

  async function SignOut() {
    setUser({} as User)
    await AsyncStorage.removeItem(dataKey)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      try {
        const userStorage = await AsyncStorage.getItem(dataKey)
        if (userStorage) {
          const userLogged = JSON.parse(userStorage) as User
          setUser(userLogged)
        }
      } catch (e) {
        console.log(e)
      }

      setUserStorageLoading(true)
    }

    loadUserStorageData()
  }, [])

  return <AuthContext.Provider value={{ user, signInWithGoogle, SignOut, userStorageLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}
