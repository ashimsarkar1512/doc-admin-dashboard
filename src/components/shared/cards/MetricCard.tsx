import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
}

export default function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-[#222327] via-[#2A303C] to-[#5C8EFE] text-white rounded-xl h-[110px]">
      <CardContent className="p-6 h-full flex flex-col justify-center">
        <p className="text-xs sm:text-sm font-medium text-slate-300 mb-1 tracking-wide">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </CardContent>
    </Card>
  );
}
