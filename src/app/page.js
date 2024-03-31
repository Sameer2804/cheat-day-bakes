import Header from "@/components/layout/Header"
import Hero from "@/components/layout/Hero"
import DessertSquare from "@/components/layout/DessertSquare"
import Promises from "@/components/layout/Promises"


export default function Home() {

  return (
    <>
      <Header />
      <Hero />
      <div className="grid grid-cols-3 max-w-5xl mx-auto gap-x-14">
        <DessertSquare text={'brownies'} image={'/Brownies.png'} />
        <DessertSquare text={'dessert cups'} image={'/DessertCups.png'} />
        <DessertSquare text={'cupcakes'} image={'/Cupcakes.png'} />
      </div>
      <Promises />
    </>
  );
}
