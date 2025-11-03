import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart2,
  Bot,
  Briefcase,
  FileText,
  Gauge,
  Ticket,
  Users,
  Workflow,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Client Management',
    description:
      'Manage client companies, contracts, and service agreements seamlessly.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Employee Information Hub',
    description:
      'Centralized repository for employee data and performance metrics.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Document Repository',
    description:
      'Securely store and manage contracts, documents, and reports.',
  },
  {
    icon: <Ticket className="h-8 w-8 text-primary" />,
    title: 'Service Request Ticketing',
    description: 'Enable clients to submit and track service requests with ease.',
  },
  {
    icon: <Gauge className="h-8 w-8 text-primary" />,
    title: 'Performance Monitoring',
    description:
      'Real-time tracking of SLAs and OKRs to ensure service delivery quality.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Process Tools',
    description:
      'Utilize Kanban, timelines, and AI suggestions to optimize processes.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: 'Analytics and Reporting',
    description: 'Generate custom reports and dashboards for continuous improvement.',
  },
];

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "1");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:text-left">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Streamline Your Service Delivery with AptaFlow
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The all-in-one platform to manage clients, employees, and processes with AI-powered insights for ultimate efficiency.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl md:h-auto">
              {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                 />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AptaFlow provides a comprehensive suite of tools designed to enhance productivity, improve client satisfaction, and drive business growth.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none lg:grid-cols-4">
              {features.slice(0, 4).map((feature) => (
                <Card key={feature.title} className="h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 sm:grid-cols-1 md:grid-cols-3 lg:max-w-5xl">
               {features.slice(4).map((feature) => (
                <Card key={feature.title} className="h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} AptaFlow Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
