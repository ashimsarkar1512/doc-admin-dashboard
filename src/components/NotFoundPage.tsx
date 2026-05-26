import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primaryBg flex flex-col items-center justify-center p-4 text-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#D8E2FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      </div>
      
      <h1 className="text-9xl font-bold text-slate-200">404</h1>
      <h2 className="mt-8 text-3xl font-bold text-slate-900 tracking-tight">Page not found</h2>
      <p className="mt-4 text-slate-500 max-w-md mx-auto text-lg">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="mt-10">
        <Link to="/">
          <Button className="h-12 px-6 bg-brand hover:bg-brand-hover text-white font-bold text-base transition-all duration-300 shadow-lg shadow-brand/20 cursor-pointer flex items-center gap-2 rounded-xl">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
