type Props = { params: { id: string } };

export default function AdminUserEditPage({ params }: Props) {
  return (
    <div style={{ padding: 24 }}>
      <h1>/admin/users/[id]/edit</h1>
      <p>Edit user ID: {params.id}</p>
    </div>
  );
}
