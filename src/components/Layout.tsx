import { ArrowLeft } from "lucide-react";

const Layout = ({ isSignClicked, handleClickSign, children }: any) => {
    return (
        <div className="h-screen overflow-hidden flex flex-col">

            <div className="fixed top-0 left-0 w-full h-16 text-2xl font-semibold text-white bg-[var(--primary-color)] flex justify-center items-center z-50 shadow-md">
                {/* Left Arrow */}
                <div className="ml-8">
                    {isSignClicked && <ArrowLeft size={24} onClick={handleClickSign} />}
                </div>

                {/* Centered Title (visually centered within available space) */}
                <div className="flex-1 text-center text-2xl font-semibold mr-8">
                    PDF Sign
                </div>
            </div>


            <main className="mt-16 overflow-auto flex-1">
                {children}
            </main>
        </div >

    );

};

export default Layout;