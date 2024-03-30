import Image from "next/image";
import Link from "next/link";
import Bag from "@/components/icons/Bag"
import Profile from "@/components/icons/Profile"
import DropdownButton from "@/components/common/DropdownButton"

export default function Home() {

  return (
    <header>
      <div className="font-ovo text-white bg-primary text-xl py-1.5 text-center">
        COLLECTION ONLY
      </div>
      <div className="max-w-4xl mx-auto flex items-center justify-between -mt-24 gap-x-28">
        <div className="size-32 relative grow basis-0">
          <Link href={''}>
            <Image src={'/logo.svg'} alt="logo" layout="fill" objectFit="contain" />
          </Link>
        </div>
        <div className="size-[420px] relative">
          <Image src={'/title.svg'} alt="Title" layout="fill" objectFit="scale-down" />
        </div>
        <div className="flex gap-x-4 justify-center grow basis-0">
          <Link href={''}>
            <Profile className="size-8 mt-px hover:scale-110 transition-transform"/>
          </Link>
          <Link href={''}>
            <Bag className="size-8 hover:scale-110 transition-transform"/>
          </Link>
        </div>
      </div>
      <div className="flex max-w-4xl mx-auto justify-between -mt-16">
        <Link href={''} className="hover:underline z-10">HOME</Link>
        <Link href={''} className="hover:underline z-10">CUPCAKES</Link>
        <Link href={''} className="hover:underline z-10">BROWNIES</Link>
        <Link href={''} className="hover:underline z-10">DESSERT CUPS</Link>
        <DropdownButton text={'ALL CATEGORIES'} options={['Cookies', 'Desserts', 'Monthly Specials']}/>
        <DropdownButton text={'MORE'} options={['About Us', 'Contact', 'Refund Policy']}/>
      </div>
    </header>
  );
}
