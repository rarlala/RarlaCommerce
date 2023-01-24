import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CountControl } from "@components/CountControl";
import { IconRefresh, IconX } from "@tabler/icons";
import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { products } from "@prisma/client";
import { CATEGORY_MAP } from "constants/products";

interface CartItem {
  name: string;
  productId: number;
  price: number;
  quantity: number;
  amount: number;
  image_url: string;
}

export default function Cart() {
  const [data, setData] = useState<CartItem[]>([]);
  const router = useRouter();
  const deliveryAmount = 3000;
  const discountAmount = 10000;

  const amount = useMemo(() => {
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0);
  }, []);

  useEffect(() => {
    const mocData = [
      {
        name: "aaa",
        productId: 100,
        price: 20000,
        quantity: 1,
        amount: 20000,
        image_url:
          "https://www.bobbies.com/c/118667-large_portrait/women-sneakers.jpg",
      },
      {
        name: "bbb",
        productId: 100,
        price: 35000,
        quantity: 1,
        amount: 20000,
        image_url:
          "https://www.bobbies.com/c/118667-large_portrait/women-sneakers.jpg",
      },
    ];

    setData(mocData);
  }, []);

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [`/api/get-products?skip=0&take=3`],
    () => fetch(`/api/get-products?skip=0&take=3`).then((res) => res.json()),
    {
      select: (data) => data.items,
    }
  );

  const handleOrder = () => {};

  return (
    <div>
      <span className="text-2xl mb-3"> Cart {data.length}</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-5 flex-1">
          {data?.length > 0 ? (
            data.map((item, idx) => <Item key={idx} {...item} />)
          ) : (
            <div>장바구니에 아무것도 없습니다.</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4 flex-1"
            style={{ minWidth: 300, border: "1px solid grey" }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{amount.toLocaleString("ko-kr")} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{deliveryAmount.toLocaleString("ko-kr")}원</span>
            </Row>
            <Row>
              <span>할인금액</span>
              <span>{discountAmount} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제 금액</span>
              <span className="font-semibold text-red-500">
                {(amount + deliveryAmount - discountAmount).toLocaleString(
                  "ko-kr"
                )}
                원
              </span>
            </Row>

            <Button
              style={{ backgroundColor: "black" }}
              radius="xl"
              size="md"
              styles={{
                root: { height: 48 },
              }}
              onClick={() => {
                // TODO handleOrder
              }}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>추천 상품</p>
        {products && (
          <div className="grid grid-cols-3 gap-5">
            {products.map((item) => (
              <div
                key={item.id}
                className="max-w-300"
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <Image
                  className="rounded m-auto"
                  src={item.image_url ?? ""}
                  alt={item.name}
                  width={300}
                  height={200}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                />
                <div className="flex">
                  <span>{item.name}</span>
                  <span className="ml-auto">
                    {item.price.toLocaleString("ko-KR")}원
                  </span>
                </div>
                <span className="text-zinc-400">
                  {CATEGORY_MAP[item.category_id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Item = (props: CartItem) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity);
  const [amount, setAmount] = useState<number>(props.quantity);
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price);
    }
  }, [quantity, props.price]);

  const handleUpdate = () => {
    // 장바구니에서 item.name 삭제
  };

  const handleDelete = () => {
    // 장바구니에서 item.name 삭제
  };

  return (
    <div className="w-full flex p-4 border-b-2 border-solid border-gray-300">
      <Image
        src={props.image_url}
        width={150}
        height={150}
        alt={props.name}
        onClick={() => router.push(`/products/${props.productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격: {props.price.toLocaleString("ko-kr")}원
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        {props.amount.toLocaleString("ko-kr")}원
      </div>
      <IconX onClick={handleDelete} />
    </div>
  );
};

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`;
