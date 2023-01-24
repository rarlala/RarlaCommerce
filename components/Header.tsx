import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IconHome, IconShoppingCart, IconUser } from "@tabler/icons";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="pt-5 pb-5">
      <div className="w-full flex h-50 items-center">
        <IconHome onClick={() => router.push("/")} />
        <span className="m-auto" />
        <IconShoppingCart
          className="mr-4"
          onClick={() => router.push("/cart")}
        />
        {session ? (
          <Image
            src={session.user?.image!}
            width={30}
            height={30}
            style={{ borderRadius: "50%" }}
            alt="profile"
            onClick={() => router.push("/my-page")}
          />
        ) : (
          <IconUser onClick={() => router.push("/auth/login")} />
        )}
      </div>
    </div>
  );
}
