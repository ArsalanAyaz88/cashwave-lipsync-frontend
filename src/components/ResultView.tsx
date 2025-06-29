
import { Download, RotateCcw, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GenerationJob {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  createdAt: string;
}

interface ResultViewProps {
  job: GenerationJob;
  onDownload: () => void;
  onStartNew: () => void;
}

const ResultView = ({ job, onDownload, onStartNew }: ResultViewProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold gradient-text">Video Generated Successfully!</h2>
        </div>
        <p className="text-muted-foreground">Your lip-sync video is ready. Preview it below and download when satisfied.</p>
      </div>

      {/* Video Player */}
      <Card className="glass-morphism neon-glow border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {/* Placeholder for actual video player */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto hover:bg-white/20 transition-colors cursor-pointer neon-glow">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-white/80">Click to play your generated video</p>
                <p className="text-sm text-white/60">Duration: 0:45 • Size: 12.3 MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onDownload}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white neon-glow font-semibold transition-all duration-300 hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Video
        </Button>
        
        <Button
          onClick={onStartNew}
          variant="outline"
          size="lg"
          className="px-8 py-3 glass-morphism border-accent/30 hover:bg-accent/10 font-semibold transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Create Another Video
        </Button>
      </div>

      {/* Generation Details */}
      <Card className="glass-morphism border-accent/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generation Details</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Job ID</p>
              <p className="font-mono">{job.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Model Used</p>
              <p>LipSync-2</p>
            </div>
            <div>
              <p className="text-muted-foreground">Generated At</p>
              <p>{new Date(job.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultView;
