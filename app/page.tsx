import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Connect Creators with Brands
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            BrandMatch is the platform where content creators and brands come
            together for authentic partnerships and meaningful collaborations.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/campaigns">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose BrandMatch?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Briefcase className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>For Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find the perfect creators for your campaigns. Post opportunities,
                  review applications, and build lasting partnerships.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>For Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover exciting brand partnerships. Apply to campaigns that
                  match your niche and grow your creator business.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 mb-4 text-primary" />
                <CardTitle>Grow Together</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build authentic relationships between creators and brands.
                  Transparent processes, fair compensation, and mutual growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join BrandMatch today and start connecting with amazing creators and brands.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
