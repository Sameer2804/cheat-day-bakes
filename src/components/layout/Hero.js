import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return(
        <section className="mt-16 relative">
            <div className="relative w-full h-[480px]">
                <Image src={"/MainCake.png"} alt={"Cake with cupcakes"} fill style={{objectFit: "cover"}} priority={true}/>
            </div>
            <div className="absolute inset-0 mx-auto my-16 w-[520px]">
                <h2 className="font-ovo text-center text-[70px] text-white leading-none tracking-wider">Freshly Baked<br />Temptation</h2>
                <p className="text-white text-center mt-8 text-lg font-light tracking-widest">Welcome to our sweet sanctuary where every treat is a symphony of flavour, crafted with care and baked to perfection.</p>
                <button className="bg-white block mx-auto mt-10 font-medium px-8 py-3 hover:bg-gray-300">ORDER NOW</button>
            </div>
        </section>
    );
}