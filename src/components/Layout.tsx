import { ArrowLeft } from "lucide-react";

const Layout = ({ isSignClicked, handleClickSign, children }: any) => {
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <div className="fixed top-0 left-0 w-full h-16 bg-[var(--primary-color)] text-white text-2xl font-semibold z-50 shadow-md flex items-center justify-between px-4">
                {isSignClicked ? (
                    <ArrowLeft size={24} onClick={handleClickSign} className="cursor-pointer" />
                ) : (
                    <div className="w-6" />
                )}
                <div className="flex-1 flex justify-center">
                    <img width={150} src="/icons/signx_logo.svg" alt="SignX Logo" />
                </div>
                <div className="w-6" />
            </div>

            <main className="mt-16 overflow-auto flex-1">
                {children}
            </main>
        </div >

    );

};

export default Layout;