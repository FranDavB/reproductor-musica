import { navbarItems, usuario } from "@/database/navbarItems";

export default function Navbar() {

  return (
    <div className="flex justify-between p-2 border-b border-gray-300">
      <ul className="flex gap-4 ml-4">
        {navbarItems.map((item) => (
          <li className="font-semibold text-sm">
            <button className='py-1 px-2 rounded-lg hover:bg-black hover:text-white'>
              {item.nombre}
            </button>
          </li>
        ))}
      </ul>
      <button className="mr-4">¡Hola, <b>{usuario[0].nombre}</b>!</button>
    </div>
  )
}