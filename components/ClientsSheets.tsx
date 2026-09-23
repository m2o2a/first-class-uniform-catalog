"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sheets = [
  { src: "/clients/clients-sheet-1.jpg", alt: "First Class clients — security, hospitals, restaurants" },
  { src: "/clients/clients-sheet-2.jpg", alt: "First Class clients — cleaning, petroleum, construction, factories" }
];

export default function ClientsSheets() {
  return (
    <div className="space-y-6">
      {sheets.map((s, i) => (
        <motion.div
          key={s.src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
          className="group rounded-2xl overflow-hidden border border-line shadow-sm hover:shadow-xl transition-shadow"
        >
          <div className="overflow-hidden">
            <Image
              src={s.src}
              alt={s.alt}
              width={1200}
              height={1500}
              className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
