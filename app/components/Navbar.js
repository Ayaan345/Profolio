import React from "react";
export default function Navbar(){
    return(
        <div className="bg-black h-10 flex justify-between items-center">
            <div>

            </div>
            <span className="text-white text-xl flex gap-10">
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </span>
        </div>
    );
}