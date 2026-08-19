import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { P2PNav } from "@/components/p2p/P2PNav";

export default function P2PLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <P2PNav />
      <main className="flex-1 min-w-0 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
