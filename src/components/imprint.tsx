import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "@/lib/navigation";
import {
  Building2,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Users,
  Scale,
  AlertCircle,
} from "lucide-react";
import InfoSection from "@/components/info-section";
import { sx } from "@/styles/sx";

export default function Imprint() {
  return (
    <main {...sx("flex-auto px-4 py-12 sm:px-6 lg:px-8")}>
      <div {...sx("mx-auto max-w-5xl mt-6")}>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          className="mb-8 text-primary hover:text-primary/80 transition-colors"
        >
          <span {...sx("mr-2")} aria-hidden="true">
            &larr;
          </span>{" "}
          Back to home
        </Button>

        <Card className="overflow-hidden shadow-lg border-none">
          <CardHeader className="bg-primary text-neutral-50">
            <h1 {...sx("text-3xl font-bold tracking-tight sm:text-4xl")}>Imprint</h1>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div {...sx("grid gap-6 sm:grid-cols-2")}>
              <InfoSection
                icon={Building2}
                title="Company"
                content={[
                  "okike Solutions e.U.",
                  "Legal Form: Sole Proprietorship",
                  "Business Purpose: IT-Services",
                ]}
              />

              <InfoSection icon={User} title="Owner" content={["Ugochukwu Uwakwe"]} />
              <InfoSection
                icon={Briefcase}
                title="Registration"
                content={[
                  "Company Register Number: 630482 f",
                  "Company Register Court: Regional Court St. Pölten",
                ]}
              />

              <InfoSection
                icon={MapPin}
                title="Location"
                content={["Company Headquarters: 3002 Purkersdorf", "Address: Wiener Straße 2/23"]}
              />

              <InfoSection icon={Phone} title="Contact" content={["Phone: +43 660 768 52 25"]} />
              <InfoSection
                icon={Mail}
                title="Email"
                content={[
                  <a
                    key="email"
                    href="mailto:info@okike-solutions.com"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    info@okike-solutions.com
                  </a>,
                ]}
              />

              <InfoSection
                icon={Users}
                title="Membership"
                content={["Member of WKO Lower Austria"]}
              />

              <InfoSection
                icon={Scale}
                title="Regulations"
                content={[
                  <span key="regulations">
                    Trade Regulations:{" "}
                    <a
                      href="https://ris.bka.gv.at"
                      {...sx("text-primary hover:text-primary/80 transition-colors")}
                    >
                      www.ris.bka.gv.at
                    </a>
                  </span>,
                ]}
              />

              <InfoSection
                icon={AlertCircle}
                title="Authority"
                content={["Trade Authority: District Administration St. Pölten"]}
              />
            </div>
            <div {...sx("mt-8 border-t pt-6 text-sm text-primary")}>
              <p>
                Consumers have the possibility to address complaints to the EU&apos;s online dispute
                resolution platform:{" "}
                <a
                  href="https://ec.europa.eu/odr"
                  {...sx("text-primary hover:text-primary/80 transition-colors")}
                >
                  www.ec.europa.eu/odr
                </a>
                . You can also address any complaints to the email address provided above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
