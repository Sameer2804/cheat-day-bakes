import DessertSquare from "@/components/layout/DessertSquare"

export default function DessertSquareSection() {
    return(

        <section className="max-w-6xl mx-auto lg:my-20 my-12 px-4">
            <div className="font-ovo text-center uppercase lg:text-5xl text-4xl leading-snug sm:mb-8 mb-5">
                our&nbsp;desserts
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 duration-300 md:gap-4 gap-2">
                <DessertSquare text={'brownies'} image={'/Brownies.png'} link={'/product-list/663763657c0a5deda8b70c5a'} />
                <DessertSquare text={'dessert cups'} image={'/DessertCups.png'} link={'/product-list/6637636e7c0a5deda8b70c60'} />
                <DessertSquare text={'cupcakes'} image={'/EidCupcakeDark.png'} link={'/product-list/663763697c0a5deda8b70c5d'} />
                <DessertSquare text={'bento boxes'} image={'/BentoBox.png'} link={'/product-list/663764337c0a5deda8b710cc'} />
                <DessertSquare text={'milk trays'} image={'/MilkTray.png'} link={'/product-list/663764367c0a5deda8b710cf'} />
                <DessertSquare text={'view all >>'} image={'/MultiDessert.png'} link={'/product-list/663763607c0a5deda8b70c57'} />
            </div>
        </section>

    )
}