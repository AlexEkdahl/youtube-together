import NextImage from '../../components/NextImage'
import {
  StartHeroContainer,
  TopTextContainer,
  BottomTextContainer,
  ImageFilter,
  TextContainer
} from './StartHero.styled'
import HeroImage from '../../public/joshua-sortino-LqKhnDzSF-8-unsplash.jpg'

export default function StartHero() {
  return (
    <StartHeroContainer>
      <NextImage src={HeroImage} isStaticImageData priority />
      <ImageFilter />
      <TextContainer>
        <TopTextContainer>
          <h1>WATCH</h1>
        </TopTextContainer>
        <BottomTextContainer>
          <h1>TOGETHER</h1>
        </BottomTextContainer>
      </TextContainer>
    </StartHeroContainer>
  )
}
