import { useEffect, useState } from 'react';
import { listGenerations, Generation } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const GenerationHistory = () => {
  const [history, setHistory] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await listGenerations();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch generation history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const StatusBadge = ({ status }: { status: Generation['status'] }) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'FAILED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
    }
  };

  return (
    <Card className="glass-morphism border-accent/20 mt-8">
      <CardHeader className="flex flex-row items-center gap-3">
        <History className="w-5 h-5 text-accent" />
        <CardTitle>Generation History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4 pr-4">
              {history.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted-foreground/20">
                  <div>
                    <p className="font-mono text-sm">{job.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(job.created_at).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No past generations found.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
