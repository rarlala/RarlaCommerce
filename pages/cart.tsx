import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CountControl } from "@components/CountControl";
import { IconRefresh, IconX } from "@tabler/icons";
import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cart, OrderItem, products } from "@prisma/client";
import { CATEGORY_MAP } from "constants/products";
import { ORDER_QUERY_KEY } from "./my";

interface CartItem extends Cart {
  name: string;
  price: number;
  image_url: string;
}

export const CART_QUERY_KEY = `/api/get-cart`;

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery<{ items: CartItem[] }, unknown, CartItem[]>(
    [CART_QUERY_KEY],
    () =>
      fetch(CART_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
  );

  const amount = useMemo(() => {
    if (data == null) {
      return 0;
    }
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0);
  }, [data]);

  const deliveryAmount = data && data.length > 0 ? 3000 : 0;
  const discountAmount = 10000;

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

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, "id">[],
    any
  >(
    (items) =>
      fetch("/api/add-order", {
        method: "POST",
        body: JSON.stringify({ items }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push("/my");
      },
    }
  );

  const handleOrder = () => {
    if (data == null) return;
    addOrder(
      data?.map((cart) => ({
        productId: cart.productId,
        price: cart.price,
        amount: cart.amount,
        quantity: cart.quantity,
      }))
    );
  };

  return (
    <div>
      <span className="text-2xl mb-3"> Cart ({data?.length})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-5 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <Item key={idx} {...item} />)
            ) : (
              <div>??????????????? ???????????? ????????????.</div>
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4 flex-1"
            style={{ minWidth: 300, border: "1px solid grey" }}
          >
            <div>Info</div>
            <Row>
              <span>??????</span>
              <span>{amount.toLocaleString("ko-kr")} ???</span>
            </Row>
            <Row>
              <span>?????????</span>
              <span>{deliveryAmount.toLocaleString("ko-kr")}???</span>
            </Row>
            <Row>
              <span>????????????</span>
              <span>{discountAmount} ???</span>
            </Row>
            <Row>
              <span className="font-semibold">?????? ??????</span>
              <span className="font-semibold text-red-500">
                {(amount + deliveryAmount - discountAmount).toLocaleString(
                  "ko-kr"
                )}
                ???
              </span>
            </Row>

            <Button
              style={{ backgroundColor: "black" }}
              radius="xl"
              size="md"
              styles={{
                root: { height: 48 },
              }}
              onClick={handleOrder}
            >
              ????????????
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>?????? ??????</p>
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
                    {item.price.toLocaleString("ko-KR")}???
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
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity);
  const [amount, setAmount] = useState<number>(props.quantity);

  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price);
    }
  }, [quantity, props.price]);

  const { mutate: updateCart } = useMutation<unknown, unknown, Cart, any>(
    (item) =>
      fetch("/api/update-cart", {
        method: "POST",
        body: JSON.stringify({ item }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (item) => {
        queryClient.cancelQueries([CART_QUERY_KEY]);
        const previous = queryClient.getQueryData([CART_QUERY_KEY]);
        queryClient.setQueryData<Cart[]>([CART_QUERY_KEY], (old) =>
          old?.filter((c) => c.id !== item.id).concat(item)
        );
        return { previous };
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onError: (error, _, context) => {
        queryClient.setQueriesData([CART_QUERY_KEY], context.previous);
      },
    }
  );

  const handleUpdate = () => {
    if (quantity == null) {
      alert("?????? ????????? ???????????????.");
      return;
    }
    updateCart({
      ...props,
      quantity: quantity,
      amount: props.price * quantity,
    });
  };

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch("/api/delete-cart", {
        method: "POST",
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (id) => {
        queryClient.cancelQueries([CART_QUERY_KEY]);
        const previous = queryClient.getQueryData([CART_QUERY_KEY]);
        queryClient.setQueryData<Cart[]>([CART_QUERY_KEY], (old) =>
          old?.filter((c) => c.id !== id)
        );
        return { previous };
      },
      onSuccess: async () => {
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onError: (error, _, context) => {
        queryClient.setQueriesData([CART_QUERY_KEY], context.previous);
      },
    }
  );

  const handleDelete = () => {
    const response = confirm("?????????????????????????");
    if (response) {
      deleteCart(props.id);
    }
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
          ??????: {props.price.toLocaleString("ko-kr")}???
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        {props.amount.toLocaleString("ko-kr")}???
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
