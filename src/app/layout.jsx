import "../app/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="p-8 mt-16">
            {/* Headerの高さ分のマージントップを追加 */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
