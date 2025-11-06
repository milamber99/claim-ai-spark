import { useState } from "react";
import { ClaimForm } from "@/components/ClaimForm";
import { Button } from "@/components/ui/button";
import { FileCheck, Shield, Zap } from "lucide-react";

const Index = () => {
  const [showClaimForm, setShowClaimForm] = useState(false);

  if (showClaimForm) {
    return <ClaimForm onBack={() => setShowClaimForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">ClaimAgent</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Fast, Smart
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vehicle Claims
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Submit your vehicle damage claim in minutes with AI-powered assessment. 
              Get instant preliminary analysis and next steps.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
              onClick={() => setShowClaimForm(true)}
            >
              Start New Claim
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Instant AI Analysis
              </h3>
              <p className="text-muted-foreground">
                Get preliminary damage assessment in seconds using advanced AI vision technology.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Simple Process
              </h3>
              <p className="text-muted-foreground">
                Upload photos, provide details, and submit - all in a few easy steps.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground">
                Your information is protected with enterprise-grade security throughout the process.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;