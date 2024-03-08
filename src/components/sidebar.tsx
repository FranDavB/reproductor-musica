"use client"

import { sidebarItems } from "@/database/sidebarItems"
import React, { useState } from "react";
import { IconType } from "react-icons";
import { BiSolidPlaylist } from "react-icons/bi";
import { MdMusicNote } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { IoLibrary } from "react-icons/io5";

type IconosType = {
  [clave: string]: IconType;
}

export default function Sidebar() {

  const [isVisible, setIsVisible] = useState(false)

  const iconos: IconosType = {
    "Playlist": BiSolidPlaylist,
    "MusicNote": MdMusicNote,
    "MusicUser": FaUser,
    "MusicMicrophone": PiMicrophoneStageFill,
    "MusicLibrary": IoLibrary
  };

  return (
    <div className="flex">
      <div
        className={`transition-all ${
          isVisible ? "ml-0 opacity-100" : "-ml-[18dvw] opacity-5"
        } duration-500 w-[18dvw] max-h-[85dvh] border-r border-gray-300 overflow-auto`}
      >

        {isVisible && (
          <div className="w-[18dvw] max-h-[85dvh] border-r border-gray-300  overflow-auto">
            {sidebarItems.map((item) => (
              <div className="mx-5 my-3">
                <h1 className="text-xl font-semibold mb-5 transition-opacity">{item.nombre}</h1>
                <ul>
                  {item.subItems.map((subItem, index) => (
                    <li key={index} className="flex align-middle px-3 py-1 mb-4 gap-3 rounded-lg hover:text-white hover:bg-black hover:cursor-pointer transition-opacity">
                      {subItem.icon && iconos[subItem.icon] &&
                        React.createElement(iconos[subItem.icon], { size: 19 })}
                      <h6 className="text-md">{subItem.nombre}</h6>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
        }
      </div>
      <button className={`transition ${isVisible ? "rotate-180 " : "rotate-0" } duration-500 p-2 text-white bg-black rounded-lg h-10`} onClick={() => setIsVisible(!isVisible)}>{`>`}</button>
    </div>
  )
}

