import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import CustomEditor from "@components/Editor";

const images = [
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1016/1000/600/",
    thumbnail: "https://picsum.photos/id/1016/250/150/",
  },
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
  {
    original: "https://picsum.photos/id/1020/1000/600/",
    thumbnail: "https://picsum.photos/id/1020/250/150/",
  },
  {
    original: "https://picsum.photos/id/1021/1000/600/",
    thumbnail: "https://picsum.photos/id/1021/250/150/",
  },
];

export default function Products() {
  const [imageIdx, setImageIdx] = useState<number>(0);

  const router = useRouter();
  const { id: productId } = router.query;
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  useEffect(() => {
    if (productId != null) {
      fetch(`/api/get-product?id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents))
              )
            );
          } else {
            setEditorState(EditorState.createEmpty());
          }
        });
    }
  }, [productId]);

  const handleSave = () => {
    if (editorState && productId != null) {
      fetch(`/api/update-product`, {
        method: "POST",
        body: JSON.stringify({
          id: productId,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
        }),
      })
        .then((res) => res.json())
        .then(() => alert("Success"));
    }
  };

  return (
    <>
      <Carousel
        autoplay
        autoplayInterval={2000}
        withoutControls
        wrapAround
        slideIndex={imageIdx}
      >
        {images.map((image) => (
          <Image
            className="m-auto"
            key={image.original}
            src={image.original}
            alt="image"
            width={1000}
            height={500}
          />
        ))}
      </Carousel>
      <ul className="flex cursor-pointer w-full">
        {images.map((image, i) => (
          <li key={image.thumbnail} onClick={() => setImageIdx(i)}>
            <Image
              src={image.thumbnail}
              alt="thumbnail"
              width={300}
              height={200}
            />
          </li>
        ))}
      </ul>
      {editorState != null && (
        <CustomEditor
          readonly={false}
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
    </>
  );
}
