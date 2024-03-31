import Image from "next/image";

export default function DessertSquare({text, image}) {
    return(
        <>
            <div className="my-28 relative group">
                <a href="" className="block relative w-full h-[290px] overflow-hidden hover:scale-105 transition-transform duration-300">
                    <Image src={image} alt="Dessert picture" fill style={{objectFit:"cover"}} sizes="(max-width: 768px) 100vw"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="uppercase text-center text-white text-xl">{text}</p>
                    </div>
                </a>
            </div>
        </>
    );
}