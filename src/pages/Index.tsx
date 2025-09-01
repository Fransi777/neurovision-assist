import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Users, Shield, Upload, BarChart3, Stethoscope, FileImage } from 'lucide-react';
import heroImage from '@/assets/hero-brain-scan.jpg';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tumor Detection",
      description: "Advanced ResNet-50 classification for Meningioma, Glioma, and Pituitary tumors with high accuracy."
    },
    {
      icon: FileImage,
      title: "Precise Segmentation",
      description: "U-Net based tumor segmentation providing detailed boundary detection and analysis."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Specialized dashboards for Radiologists, Doctors, Specialists, and Receptionists."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring patient data protection and regulatory compliance."
    },
    {
      icon: Upload,
      title: "Multi-Format Support",
      description: "Support for DICOM, NIfTI, and standard image formats with automated preprocessing."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics for clinical decision support."
    }
  ];

  const roles = [
    {
      title: "Radiologist",
      description: "Upload and analyze MRI scans, visualize results, generate reports",
      icon: Stethoscope,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Doctor", 
      description: "Access patient summaries, review AI analysis, track treatment progress",
      icon: Activity,
      color: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    {
      title: "Specialist",
      description: "Perform advanced analysis, comparative studies, research insights",
      icon: Brain,
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Receptionist",
      description: "Manage patient information, appointments, workflow coordination",
      icon: Users,
      color: "bg-gradient-to-br from-amber-500 to-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold medical-gradient-text">NeuroVision Assist</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="medical-outline" size="sm" onClick={() => window.location.href = '/login'}>Sign In</Button>
              <Button variant="medical" size="sm" onClick={() => window.location.href = '/login'}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight">
                  Advanced <span className="medical-gradient-text">Brain Tumor</span> Detection & Segmentation
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Revolutionizing neurological diagnosis with AI-powered MRI analysis, providing precise tumor classification and segmentation for enhanced clinical decision-making.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" className="flex items-center gap-2" onClick={() => window.location.href = '/login'}>
                  <Upload className="h-5 w-5" />
                  Start Analysis
                </Button>
                <Button variant="medical-outline" size="xl" onClick={() => window.location.href = '/login'}>
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.2%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">&lt; 30s</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Scans Analyzed</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-medical-xl">
                <img 
                  src={heroImage} 
                  alt="Medical brain scan analysis interface" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Powerful Features for Medical Professionals</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with intuitive design to enhance diagnostic capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="medical-card hover:scale-105 transition-transform">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Dashboards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Tailored for Every Medical Professional</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized interfaces designed for different healthcare roles, ensuring optimal workflow and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="medical-card group cursor-pointer hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`${role.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-white">
            <h2 className="text-4xl font-bold">Ready to Transform Your Diagnostic Workflow?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Join leading medical institutions worldwide using NeuroVision Assist for enhanced brain tumor detection and analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90" onClick={() => window.location.href = '/login'}>
                Start Free Trial
              </Button>
              <Button variant="medical-outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.location.href = '/login'}>
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold medical-gradient-text">NeuroVision Assist</span>
            </div>
            <p className="text-muted-foreground">
              Advancing neurological diagnosis through artificial intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;