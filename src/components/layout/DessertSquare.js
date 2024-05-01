import Image from "next/image";

export default function DessertSquare({text, image, link}) {
    return(
        <>
            <div className="relative group">
                <a href={link} className="block relative overflow-hidden [@media(hover:hover){&:hover}]:scale-105 transition-transform duration-300">
                    <Image src={image} alt="Dessert picture" width={500} height={500} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="uppercase text-center text-white text-xl md:text-2xl lg:font-medium font-normal">{text}</p>
                    </div>
                </a>
            </div>
        </>
    );
}