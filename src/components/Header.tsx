
import { Waves, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-accent/20 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Waves className="w-8 h-8 text-accent animate-pulse-glow" />
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">CashWave HQ</h1>
              <p className="text-sm text-muted-foreground">Lip-Sync Generator</p>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">Professional AI-Powered Video Generation</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
