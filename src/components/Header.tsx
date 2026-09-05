import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
      <h1 className="font-bold text-[#1F2937]">Cerberus</h1>
    </header>
  )
}
