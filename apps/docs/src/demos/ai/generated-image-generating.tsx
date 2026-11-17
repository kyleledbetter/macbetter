import { GeneratedImage, GeneratedImageStage } from "macbetter/generated-image"

export default function Example() {
  return (
    <GeneratedImage state="generating" aspectRatio="4 / 3" style={{ maxWidth: 440 }}>
      <GeneratedImageStage />
    </GeneratedImage>
  )
}
