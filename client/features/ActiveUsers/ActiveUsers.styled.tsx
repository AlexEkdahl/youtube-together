import styled from 'styled-components'

import { colors, spacings } from '../../styles/variables'

type ColorProp = {
  color: string
}

export const Container = styled.div`
  padding: ${spacings.extraSmall};
`

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
`

// @TODO - revisit - width will probably be resized according to window size
export const Avatar = styled.img`
  width: 40px;
  border-radius: 50%;
  margin: ${spacings.extraExtraSmall};
`

export const Name = styled.h4<ColorProp>`
  color: ${(props) => props.color || colors.white};
`
