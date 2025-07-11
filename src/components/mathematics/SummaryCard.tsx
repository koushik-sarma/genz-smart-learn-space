import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  content: string;
  isCode?: boolean;
}

export default function SummaryCard({ title, content, isCode = false }: SummaryCardProps) {
  const items = content.split(/[;.]/).filter(item => item.trim());

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isCode ? (
          <div className="text-gray-300 space-y-3">
            {items.map((item, index) => (
              <div key={index} className="bg-slate-800/50 p-3 rounded-md border border-white/10">
                <code className="text-purple-300 font-mono text-sm">{item.trim()}</code>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-300 mt-1">•</span>
                <span>{item.trim()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}