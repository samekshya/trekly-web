"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";


interface Trek {
  _id: string;
  name: string;
  location: string;
  price: number;
  difficulty: string;
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const token = localStorage.getItem("token"); // the JWT you got on login

        const res = await fetch("http://localhost:5050/api/treks", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load treks");
        }

        const data = await res.json();
        setTreks(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  
  const handleDelete = async (id: string) => {
    const yes = window.confirm("Are you sure you want to delete this trek?");
    if (!yes) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Failed to delete trek");
        return;
      }

      setTreks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Error deleting trek");
    }
  };
  

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading treks...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>
    );
  }

    return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Treks</h1>
          <a
            href="/admin/treks/new"
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition"
          >
            + New Trek
          </a>
        </div>

        {treks.length === 0 ? (
          <p className="text-gray-600">No treks found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treks.map((trek) => (
                  <tr
                    key={trek._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {trek.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {trek.location}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {trek.difficulty}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      Rs. {trek.price}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <a
                        href={`/admin/treks/${trek._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(trek._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


// "use client";

// import { useEffect, useState } from "react";

// interface Trek {
//   _id: string;
//   name: string;
//   location: string;
//   price: number;
//   difficulty: string;
// }

// export default function AdminTreksPage() {
//   const [treks, setTreks] = useState<Trek[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTreks = async () => {
//       try {
//         const token = localStorage.getItem("token"); // the JWT you got on login

//         const res = await fetch("http://localhost:5050/api/treks", {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         });

//         if (!res.ok) {
//           const data = await res.json().catch(() => ({}));
//           throw new Error(data.message || "Failed to load treks");
//         }

//         const data = await res.json();
//         setTreks(data.data || []);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTreks();
//   }, []);

//     const handleDelete = async (id: string) => {
//     const yes = window.confirm("Are you sure you want to delete this trek?");
//     if (!yes) return;

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`http://localhost:5050/api/treks/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         alert(data.message || "Failed to delete trek");
//         return;
//       }

//       setTreks((prev) => prev.filter((t) => t._id !== id));
//     } catch (err) {
//       alert("Error deleting trek");
//     }
//   };


//   if (loading) {
//     return <div style={{ padding: "20px" }}>Loading treks...</div>;
//   }

//   if (error) {
//     return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
//   }

//     return (
//     <div style={{ padding: "20px" }}>
//       <h1>Admin – Treks List</h1>
//       {treks.length === 0 ? (
//         <p>No treks found.</p>
//       ) : (
//         <ul>
//           {treks.map((trek) => (
//             <li key={trek._id}>
//               {trek.name} – {trek.location} – Rs. {trek.price} –{" "}
//               {trek.difficulty}{" "}
//               <a
//                 href={`/admin/treks/${trek._id}/edit`}
//                 style={{ color: "blue" }}
//               >
//                 Edit
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


