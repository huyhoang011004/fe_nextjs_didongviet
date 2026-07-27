// app/(shop)/layout.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className='flex-1 overflow-x-hidden pt-[100px] md:pt-[110px]'>
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
