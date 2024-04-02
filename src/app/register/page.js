import Image from "next/image";

export default function RegisterPage() {
    return(
        <section className="max-w-4xl mx-auto my-14">
            <h1 className="font-ovo text-center text-5xl">Register</h1>
            <form className="max-w-sm mx-auto mt-8">
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" autoComplete="email"/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" autoComplete="current-password"/>
                </div>
                <div className="max-w-[19rem] mx-auto">
                    <button className="mx-auto mt-8" type="submit">Register</button>
                    <div className="text-center my-3 text-gray-500 tracking-widest">
                        OR
                    </div>
                    <button className="w-full mx-auto border border-black py-3 flex gap-2 justify-center hover:bg-gray-50">
                        <Image src={'/Google.svg'} alt="" width={24} height={24}/>
                        Login with Google
                    </button>
                </div>
            </form>
        </section>
    );
}