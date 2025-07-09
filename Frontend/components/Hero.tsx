import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-10 relative overflow-hidden 
  bg-gradient-to-br from-white to-gray-50/70 dark:from-gray-900/95 dark:to-gray-800/90">
      
      {/* Enhanced geometric pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-300/30 to-transparent dark:from-gray-600/30"></div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-10 dark:opacity-25 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center max-w-4xl mt-12">
        <Badge variant="outline" className="mb-6 sm:mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-2 border-gray-300 dark:border-gray-600">
          <Globe className="h-4 w-4 mr-2" />
          Transforming Resilient Procurement
        </Badge>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
          <span className="gradient-text">ProcurePro</span>
          <br />
          Smarter Procurement.
          <br />
          Greater Impact.
        </h1>

        <div className="mb-6 sm:mb-8">
          <span className="gradient-text text-3xl sm:text-4xl md:text-5xl font-bold">
            Scale at Speed
          </span>
        </div>    
      
        <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-6 mb-8 sm:mb-10">
          Empowering smarter, Resilient procurement with AI-driven insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <Link href="/auth" className="w-full sm:w-auto">
            <Button className="w-full px-8 h-12 rounded-lg bg-gradient-to-r from-[#E2142D] to-[#2563eb] hover:from-[#E2142D]/90 hover:to-[#2563eb]/80 transition-all duration-300 hover:shadow-xl font-bold text-white text-lg tracking-wide shadow-lg hover:scale-105 transform">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#about" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full px-8 h-12 rounded-lg border-gray-700 text-gray-700 dark:border-gray-300 dark:text-gray-300 font-bold hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 transform">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}