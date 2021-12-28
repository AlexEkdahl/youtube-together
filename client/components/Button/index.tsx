import { ButtonStyled } from './Button.styled'

type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: string
}

function Button({ children, onClick }: ButtonProps) {
  return <ButtonStyled onClick={onClick}>{children}</ButtonStyled>
}

export default Button
