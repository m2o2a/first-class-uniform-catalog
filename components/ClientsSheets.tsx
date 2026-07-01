import Image from "next/image";

export default function ClientsSheets() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden border border-line">
        <Image
          src="/clients/clients-sheet-1.jpg"
          alt="First Class clients — security, hospitals, restaurants"
          width={1200}
          height={1500}
          className="w-full h-auto"
        />
      </div>
      <div className="rounded-2xl overflow-hidden border border-line">
        <Image
          src="/clients/clients-sheet-2.jpg"
          alt="First Class clients — cleaning, petroleum, construction, factories"
          width={1200}
          height={1500}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
