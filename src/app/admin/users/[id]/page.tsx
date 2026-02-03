type Props = { params: { id: string } };

export default function AdminUserIdPage({ params }: Props) {
  return (
    <div style={{ padding: 24 }}>
      <h1>/admin/users/[id]</h1>
      <p>ID: {params.id}</p>
    </div>
  );
}
