import { ReactNode } from "react";
import Link from "next/link";
import { Gem } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="p-6">
        <nav className="container mx-auto">
          <Link href="/" className="flex w-fit items-center space-x-2">
            <Gem className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TenTenTen</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}
