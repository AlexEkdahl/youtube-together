import styled, { css } from 'styled-components'

import {
  fontSizes,
  borderRadius,
  colors,
  borders,
  fonts
} from '../../../styles/variables'

export type TextErrorProp = {
  hasErrorMsg: boolean
}

export const inputBaseStyle = css`
  display: inline-block;
  box-sizing: border-box;
  background: ${colors.lightPink};
  font-size: ${fontSizes.small};
  font-family: ${fonts.roboto};
  border-radius: ${borderRadius.small};
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 34px;
  width: 100%;
`

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  max-width: 23rem;
  max-height: 100%;
  font-family: ${fonts.roboto};
`

export const WrapperInner = styled.div`
  position: relative;
  margin-top: 4px;
`
export const Label = styled.label<TextErrorProp>`
  color: ${(props) => (props.hasErrorMsg ? colors.danger : colors.white)};
`

export const Input = styled.input<TextErrorProp>`
  ${inputBaseStyle}
  border: ${(props) => (props.hasErrorMsg ? borders.danger : borders.light)};
  color: ${(props) => (props.hasErrorMsg ? colors.danger : colors.darkest)};
  &:focus {
    border: ${(props) =>
      props.hasErrorMsg ? borders.danger : `1px solid lightpink`};
    outline: none;
    box-shadow: inset 0 2px 10px 0 rgba(0, 0, 0, 0.3);
  }
`

export const ErrMsg = styled.span`
  color: ${colors.danger};
  font-size: 0.75rem;
  padding-left: 8px;
  padding-top: 4px;
`