import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="container px-4 py-8 animate-fadeIn">{children}</main>
      <Footer />
    </div>
  );
}
