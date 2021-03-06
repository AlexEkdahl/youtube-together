import {
  AnimationEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react'

import { PlaylistItemData } from '../../types'
import { useForm } from '../../hooks/useForm'
import { validateUrl } from '../../utils/formValidationRules'
import { TextInput } from '../../components/TextInput'
import {
  AddItemContainer,
  AddItemText,
  PlaylistInputContainer
} from './Playlist.styled'

type PlaylistInputProps = {
  actionsPermitted: boolean
  setPlaylist: Dispatch<SetStateAction<PlaylistItemData[]>>
  onVideoAdd?: (item: PlaylistItemData) => Promise<boolean>
}

export default function PlaylistInput({
  setPlaylist,
  onVideoAdd,
  actionsPermitted = true
}: PlaylistInputProps) {
  const { values, onChangeHandler } = useForm({ url: '' }, () => null)

  const [isUrlValid, setIsUrlValid] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isItemVisible, setIsVisible] = useState(false)
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [shouldItemFadeIn, setShouldItemFadeIn] = useState(true)
  const [shouldTextFadeIn, setShouldTextFadeIn] = useState(true)
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [id, setId] = useState(1)

  const ref = useRef<HTMLDivElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChangeHandler(e)
    hasError && setHasError(false)
    currentTimeout && clearTimeout(currentTimeout)

    const timeout = setTimeout(() => {
      const isValid = validateUrl(e.target.value)
      setIsUrlValid(isValid)
      setHasError(!isValid)
      setCurrentTimeout(null)
    }, 300)
    setCurrentTimeout(timeout)
  }

  function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (ref.current === e.target) {
      shouldItemFadeIn
        ? (setShouldTextFadeIn(true), setIsTextVisible(true))
        : setIsVisible(false)
    }
  }

  function handleTextAnimationEnd() {
    !shouldTextFadeIn && (setIsTextVisible(false), setShouldItemFadeIn(false))
  }

  async function addItem() {
    if (!actionsPermitted) return
    const res = await fetch(`https://noembed.com/embed?url=${values.url}`)
    const { title } = await res.json()

    const success =
      onVideoAdd &&
      onVideoAdd({
        url: values.url,
        title
      })

    if (success || !onVideoAdd) {
      setPlaylist((prev) => [
        ...prev,
        { _id: id, url: values.url, title: title ? title : 'No Title' }
      ])
      setId((prev) => prev + 1)
      values.url = ''
      setIsUrlValid(false)
    }
  }

  useEffect(() => {
    isUrlValid
      ? !isItemVisible && setIsVisible(true)
      : setShouldTextFadeIn(false)
  }, [isUrlValid])

  useEffect(() => {
    isItemVisible && !shouldItemFadeIn && setShouldItemFadeIn(true)
  }, [isItemVisible])

  useEffect(() => {
    isTextVisible && !shouldTextFadeIn && setShouldTextFadeIn(true)
  }, [isTextVisible])

  return (
    <PlaylistInputContainer>
      <TextInput
        label="Paste a youtube video url here"
        name="url"
        value={values.url}
        error={
          hasError
            ? 'You can only paste links to youtube videos here'
            : undefined
        }
        onChange={handleChange}
        removeBottomRadius={isItemVisible}
        disable={!actionsPermitted}
        noAutoComplete
      />
      {isItemVisible && (
        <AddItemContainer
          ref={ref}
          onClick={addItem}
          shouldAddItemFadeIn={shouldItemFadeIn}
          onAnimationEnd={handleAnimationEnd}
        >
          <div>
            {isTextVisible && (
              <AddItemText
                onAnimationEnd={(e) => (
                  e.stopPropagation(), handleTextAnimationEnd()
                )}
                shouldTextFadeIn={shouldTextFadeIn}
              >
                Add item to playlist
              </AddItemText>
            )}
          </div>
        </AddItemContainer>
      )}
    </PlaylistInputContainer>
  )
}
