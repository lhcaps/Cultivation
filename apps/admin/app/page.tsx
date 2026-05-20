import "./globals.css";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-amber-400">Thiên Đạo</h1>
        <p className="text-sm text-gray-500">Admin Panel — Thiên Nam Engine</p>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminCard title="Người chơi" href="/players" />
          <AdminCard title="Tông môn" href="/sects" />
          <AdminCard title="Sự kiện" href="/events" />
          <AdminCard title="Vật phẩm" href="/items" />
          <AdminCard title="Nhật ký" href="/logs" />
          <AdminCard title="Kiểm toán" href="/audit" />
        </div>
      </div>
    </main>
  );
}

function AdminCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="block p-6 rounded-lg border border-gray-800 bg-gray-900 hover:border-amber-600 transition-colors"
    >
      <h2 className="text-lg font-semibold text-amber-400">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">Quản lý {title.toLowerCase()}</p>
    </a>
  );
}
