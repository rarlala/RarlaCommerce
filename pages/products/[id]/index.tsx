import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Cart, products } from "@prisma/client";
import Carousel from "nuka-carousel";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import CustomEditor from "@components/Editor";
import { format } from "date-fns";
import { CATEGORY_MAP } from "constants/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mantine/core";
import { IconHeart, IconHeartbeat, IconShoppingCart } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { CountControl } from "@components/CountControl";
import { CART_QUERY_KEY } from "pages/cart";

export async function getServerSideProps(context: GetServerSideProps) {
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items);
  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
    },
  };
}

export default function Products(props: {
  product: products & { images: string[] };
}) {
  const [imageIdx, setImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const { data: session } = useSession();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: productId } = router.query;
  const [editorState, setEditorState] = useState<EditorState | undefined>(() =>
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  );

  const WISHLIST_QUERY_KEY = "/api/get-wishlist";

  const { data: wishlist } = useQuery([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  );

  const { mutate } = useMutation<unknown, unknown, string, any>(
    (productId) =>
      fetch("/api/update-wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (productId) => {
        queryClient.cancelQueries([WISHLIST_QUERY_KEY]);
        const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY]);
        queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id !== String(productId))
              : old.concat(String(productId))
            : []
        );
        return { previous };
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY]);
      },
      onError: (error, _, context) => {
        queryClient.setQueriesData([WISHLIST_QUERY_KEY], context.previous);
      },
    }
  );

  const product = props.product;

  const { mutate: addCart } = useMutation<
    unknown,
    unknown,
    Omit<Cart, "id" | "userId">,
    any
  >(
    (item) =>
      fetch("/api/add-cart", {
        method: "POST",
        body: JSON.stringify({ item }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push("/cart");
      },
    }
  );

  const validate = (type: "cart" | "order") => {
    if (quantity == null) {
      alert("최소 수량을 선택하세요.");
      return;
    }

    if (type === "cart") {
      addCart({
        productId: product.id,
        quantity: quantity,
        amount: product.price * quantity,
      });
    }
  };

  const isWished =
    wishlist != null && productId != null
      ? wishlist.includes(productId)
      : false;

  return (
    <>
      {product != null && productId != null ? (
        <div className="flex flex-row">
          <div className="max-w-600 mr-12 ">
            <Carousel
              autoplay
              autoplayInterval={2000}
              withoutControls
              wrapAround
              slideIndex={imageIdx}
            >
              {product.images.map((url, idx) => (
                <Image
                  className="m-auto"
                  key={`${url}-carousel-${idx}`}
                  src={url}
                  alt="image"
                  width={1000}
                  height={500}
                />
              ))}
            </Carousel>
            <ul className="flex cursor-pointer w-full mt-10">
              {product.images.map((url, idx) => (
                <li
                  key={`${url}-thumb-${idx}`}
                  onClick={() => setImageIdx(idx)}
                >
                  <Image src={url} alt="thumbnail" width={300} height={200} />
                </li>
              ))}
            </ul>
            {editorState != null && (
              <CustomEditor readonly editorState={editorState} />
            )}
          </div>
          <div className="max-w-600 flex flex-col space-y-6">
            <div className="text-lg text-zinc-400">
              {CATEGORY_MAP[product.category_id - 1]}
            </div>
            <div className="text-2xl font-semibold">{product.name}</div>
            <div className="text-lg">
              {product.price.toLocaleString("ko-kr")}원
            </div>
            <div>
              <span className="text-lg">수량</span>
              <CountControl value={quantity} setValue={setQuantity} />
            </div>
            <div className="flex space-x-4">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                style={{ backgroundColor: "black" }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert("로그인 필요합니다");
                    router.push("/auth/login");
                  }
                  validate("cart");
                }}
              >
                장바구니
              </Button>
              <Button
                disabled={isWished == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? "red" : "grey" }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert("로그인 필요합니다");
                    router.push("/auth/login");
                  }
                  mutate(String(productId));
                }}
              >
                찜하기
              </Button>
            </div>
            <div className="text-sm text-zinc-300">
              {format(new Date(product.createdAt), "yyyy년 M월 d일")}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중</div>
      )}
    </>
  );
}
