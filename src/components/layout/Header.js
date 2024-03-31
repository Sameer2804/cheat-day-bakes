import Image from "next/image";
import Link from "next/link";
import Bag from "@/components/icons/Bag"
import Profile from "@/components/icons/Profile"
import DropdownButton from "@/components/common/DropdownButton"

export default function Header(){
    return (
        <header>
            <div className="font-ovo text-white bg-primary text-xl py-1.5 text-center">
            COLLECTION ONLY
            </div>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-x-28 mt-12">
            <div className="size-32 relative grow basis-0" >
                <Link href={''}>
                <Image src={'/logo.svg'} alt="logo" fill style={{objectFit:"cover"}} />
                </Link>
            </div>
            <div className="w-[370px] h-[170px] relative">
                <Image src={'/title.svg'} alt="Title" fill style={{objectFit:"cover"}} priority={true}/>
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
            <div className="flex max-w-4xl mx-auto justify-between mt-20">
                <Link href={''} className="hover:underline">HOME</Link>
                <Link href={''} className="hover:underline">CUPCAKES</Link>
                <Link href={''} className="hover:underline">BROWNIES</Link>
                <Link href={''} className="hover:underline">DESSERT CUPS</Link>
                <DropdownButton text={'ALL CATEGORIES'} options={['Cupcakes', 'Brownies', 'Dessert Cups', 'Cookies', 'Monthly Specials']}/>
                <DropdownButton text={'MORE'} options={['About Us', 'Contact', 'Refund Policy']}/>
            </div>
        </header>
    );
}