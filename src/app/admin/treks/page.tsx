export default function AdminTreksPage() {
  const treks = [
    { id: 1, name: "Test Trek 1", location: "Pokhara", price: 100 },
    { id: 2, name: "Test Trek 2", location: "Kathmandu", price: 150 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin – Treks List (Static)</h1>
      <ul>
        {treks.map((trek) => (
          <li key={trek.id}>
            {trek.name} – {trek.location} – Rs. {trek.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
