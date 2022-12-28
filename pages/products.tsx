// import Head from "next/head";
import Image from "next/image";
import Carousel from "nuka-carousel";
import { useState } from "react";

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
    original: "https://picsum.photos/id/1020/1000/600/",
    thumbnail: "https://picsum.photos/id/1020/250/150/",
  },
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

export default function Products() {
  const [imageIdx, setImageIdx] = useState<number>(0);

  return (
    <>
      {/* TODO: SEO를 위한 og 설정 */}
      {/* <Head>
        <meta property="og:url" content="product url" />
        <meta property="og:type" content="product" />
        <meta property="og:title" content="product title" />
        <meta property="og:description" content="product desc" />
        <meta property="og:image" content="product image" />
      </Head> */}
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
    </>
  );
}
