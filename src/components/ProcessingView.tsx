
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingViewProps {
  status: string;
}

const ProcessingView = ({ status }: ProcessingViewProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      <Card className="glass-morphism neon-glow-purple border-0 animate-float">
        <CardContent className="p-12">
          <div className="space-y-6">
            {/* Animated Logo */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-spin opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-accent to-primary rounded-full animate-spin opacity-40" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
              <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold gradient-text">Generating Your Video</h2>
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                <p className="text-lg text-muted-foreground">{status}</p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <Zap className="w-6 h-6 text-accent animate-pulse" />
                <p className="text-sm font-medium">AI Processing</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                <p className="text-sm font-medium">Lip Sync</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--neon-pink))] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <p className="text-sm font-medium">Rendering</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground">
                <strong>Processing Time:</strong> This usually takes 2-5 minutes depending on video length and complexity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingView;
