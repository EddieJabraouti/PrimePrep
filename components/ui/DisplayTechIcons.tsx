import React from 'react'
import {getTechLogos} from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/lib/utils"

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
    const techIcons = await getTechLogos(techStack);
    return (
        <div className="flex flex-row">{techIcons.slice(0,3).map(({tech, url}, index) => (
            <div key={tech} className="relative group bg-dark-200 rounded-full p-2 flex-center">
                <span className="tech-tooltip">{tech}</span>
                <Image src={url} alt={tech} width={100} height={100} className="size-5"></Image>
            </div>
        ))}</div>
    )
}
export default DisplayTechIcons
