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

import * as m from "@/paraglide/messages.js";
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
          {m.copy_back_to_home()}
        </Button>

        <Card className="overflow-hidden shadow-lg border-none">
          <CardHeader className="bg-primary text-neutral-50">
            <h1 {...sx("text-3xl font-bold tracking-tight sm:text-4xl")}>{m.copy_imprint()}</h1>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div {...sx("grid gap-6 sm:grid-cols-2")}>
              <InfoSection
                icon={Building2}
                title={m.copy_company()}
                content={[
                  m.copy_okike_solutions_e_u(),
                  m.copy_legal_form_sole_proprietorship(),
                  m.copy_business_purpose_it_services(),
                ]}
              />

              <InfoSection
                icon={User}
                title={m.copy_owner()}
                content={[m.copy_ugochukwu_uwakwe()]}
              />
              <InfoSection
                icon={Briefcase}
                title={m.copy_registration()}
                content={[
                  m.copy_company_register_number_630482_f(),
                  m.copy_company_register_court_regional_court_st_p_lten(),
                ]}
              />

              <InfoSection
                icon={MapPin}
                title={m.copy_location()}
                content={[
                  m.copy_company_headquarters_3002_purkersdorf(),
                  m.copy_address_wiener_stra_e_2_23(),
                ]}
              />

              <InfoSection
                icon={Phone}
                title={m.copy_contact()}
                content={[m.copy_phone_43_660_768_52_25()]}
              />
              <InfoSection
                icon={Mail}
                title={m.copy_email()}
                content={[
                  <a
                    key="email"
                    href="mailto:info@okike-solutions.com"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_info_okike_solutions_com()}
                  </a>,
                ]}
              />

              <InfoSection
                icon={Users}
                title={m.copy_membership()}
                content={[m.copy_member_of_wko_lower_austria()]}
              />

              <InfoSection
                icon={Scale}
                title={m.copy_regulations()}
                content={[
                  <span key="regulations">
                    {m.copy_trade_regulations()}{" "}
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
                title={m.copy_authority()}
                content={[m.copy_trade_authority_district_administration_st_p_lten()]}
              />
            </div>
            <div {...sx("mt-8 border-t pt-6 text-sm text-primary")}>
              <p>
                {m.copy_consumers_have_the_possibility_to_address_complaints_to_the_eu_s()}{" "}
                <a
                  href="https://ec.europa.eu/odr"
                  {...sx("text-primary hover:text-primary/80 transition-colors")}
                >
                  {m.copy_www_ec_europa_eu_odr()}
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
