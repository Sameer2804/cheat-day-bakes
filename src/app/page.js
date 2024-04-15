import Hero from "@/components/layout/Hero"
import DessertSquare from "@/components/layout/DessertSquare"
import Promises from "@/components/layout/Promises"

export default function Home() {

  return (
    <>
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-x-14 px-4 my-24">
        <DessertSquare text={'brownies'} image={'/Brownies.png'} link={'/product-list/6610b3a2555875c2afaa2ad9'} />
        <DessertSquare text={'dessert cups'} image={'/DessertCups.png'} link={'/product-list/6610bd0c8a3885d3110a5943'} />
        <DessertSquare text={'cupcakes'} image={'/Cupcakes.png'} link={'/product-list/6610b6e4555875c2afaa2afd'} />
      </div>
      <Promises />
    </>
  );
}
