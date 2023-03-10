import { categories, products } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { Input, Pagination, SegmentedControl, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { CATEGORY_MAP, ORDER_BY, TAKE } from "constants/products";
import useDebounce from "hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [activePage, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string>("-1");
  const [selectedOrderBy, setOrderBy] = useState<string | null>(
    ORDER_BY[0].value
  );
  const [keyword, setKeyword] = useState<string>("");

  const debounceKeyword = useDebounce<string>(keyword);

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    [`/api/get-categories`],
    () => fetch(`/api/get-categories`).then((res) => res.json()),
    {
      select: (data) => data.items,
    }
  );

  const { data: total } = useQuery(
    [
      `/api/get-products-count?category=${selectedCategories}&contains=${debounceKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-products-count?category=${selectedCategories}&contains=${debounceKeyword}`
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.items / TAKE))
  );

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [
      `/api/get-products?skip=${
        TAKE * (activePage - 1)
      }&take=${TAKE}&category=${selectedCategories}&orderBy=${selectedOrderBy}&contains=${debounceKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-products?skip=${
          TAKE * (activePage - 1)
        }&take=${TAKE}&category=${selectedCategories}&orderBy=${selectedOrderBy}&contains=${debounceKeyword}`
      ).then((res) => res.json()),
    {
      select: (data) => data.items,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Select value={selectedOrderBy} onChange={setOrderBy} data={ORDER_BY} />
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          value={keyword}
          onChange={handleChange}
        />
      </div>
      {categories && (
        <div className="mb-4">
          <SegmentedControl
            value={selectedCategories}
            onChange={setSelectedCategories}
            data={[
              { label: "All", value: "-1" },
              ...categories.map((category) => ({
                label: category.name,
                value: String(category.id),
              })),
            ]}
            color="dart"
          />
        </div>
      )}
      {!products && (
        <div className="w-full text-center mt-20">
          {debounceKeyword
            ? "?????? ????????? ????????????"
            : "???????????? ????????? ????????????"}
        </div>
      )}
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
      <div className="w-full flex mt-5">
        {total && (
          <Pagination
            className="m-auto"
            page={activePage}
            onChange={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
