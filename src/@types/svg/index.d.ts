declare module "*.svg" {
  import react from 'react'
  import {} from 'react-native-svg'
  const content: react.FC<SvgProps>
  export default content
}