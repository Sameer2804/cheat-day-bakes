import Image from "next/image";

export default function DessertSquare({text, image, link}) {
    return(
        <>
            <div className="my-4 relative group">
                <a href={link} className="block relative w-full h-[320px] overflow-hidden hover:scale-105 transition-transform duration-300">
                    <Image src={image} alt="Dessert picture" fill style={{objectFit:"contain"}} sizes="(max-width: 768px) 100vw"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="uppercase text-center text-white text-xl font">{text}</p>
                    </div>
                </a>
            </div>
        </>
    );
}