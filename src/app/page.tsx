"use client";
import React, { useEffect, useState } from 'react';
import api from '@/api/api';

export default function HomePage() {
  const [treks, setTreks] = useState([]);

  // In a real app, you'd fetch this from your GET /api/treks
  useEffect(() => {
    // Example fetch call
    // const fetchTreks = async () => { ... }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <header className="h-[60vh] bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa')] bg-cover bg-center flex items-center justify-center text-white">
        <div className="bg-black/40 p-10 rounded-xl text-center backdrop-blur-sm">
          <h1 className="text-5xl font-extrabold mb-4">Explore the Himalayas</h1>
          <p className="text-xl">Discover and book the most beautiful treks in Nepal.</p>
        </div>
      </header>

      {/* 2. Trek Grid */}
      <section className="max-w-7xl mx-auto p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Popular Treks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* We will map over your treks here */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
              <div className="h-48 bg-gray-200"></div> {/* Replace with img */}
              <div className="p-6">
                <h3 className="text-xl font-bold">Everest Base Camp</h3>
                <p className="text-gray-600 text-sm my-2">14 Days • Moderate Difficulty</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-700 font-bold">$1,299</span>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-lg">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className={styles.intro}>
//           <h1>To get started, edit the page.tsx file.</h1>
//           <p>
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className={styles.secondary}
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
