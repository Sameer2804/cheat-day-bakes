import DessertSquare from "@/components/layout/DessertSquare"

export default function DessertSquareSection() {
    return(

        <section className="max-w-6xl mx-auto lg:my-20 my-12 px-4">
            <div className="font-ovo text-center uppercase lg:text-5xl text-4xl leading-snug sm:mb-8 mb-5">
                our&nbsp;desserts
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 duration-300 md:gap-4 gap-2">
                <DessertSquare text={'brownies'} image={'/Brownies.png'} link={'/product-list/6610b3a2555875c2afaa2ad9'} />
                <DessertSquare text={'dessert cups'} image={'/DessertCups.png'} link={'/product-list/6610bd0c8a3885d3110a5943'} />
                <DessertSquare text={'cupcakes'} image={'/EidCupcakeDark.png'} link={'/product-list/6610b6e4555875c2afaa2afd'} />
                <DessertSquare text={'bento boxes'} image={'/BentoBox.png'} link={'/product-list/6610b3a2555875c2afaa2ad9'} />
                <DessertSquare text={'milk trays'} image={'/MilkTray.png'} link={'/product-list/6610bd0c8a3885d3110a5943'} />
                <DessertSquare text={'view all >>'} image={'/MultiDessert.png'} link={'/product-list/6610b6e4555875c2afaa2afd'} />
            </div>
        </section>

    )
}