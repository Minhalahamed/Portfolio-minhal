import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProfileCard } from '@/components/ProfileCard';
import { Terminal } from '@/components/Terminal';

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="hidden lg:flex lg:w-1/3 border-r border-terminal-border">
          <ProfileCard />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Terminal />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
