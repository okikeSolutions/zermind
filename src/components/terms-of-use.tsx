import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "@/lib/navigation";
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Gavel,
  Bot,
  Key,
  Ban,
  RefreshCw,
} from "lucide-react";
import InfoSection from "@/components/info-section";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export default function TermsOfUse() {
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
            <h1 {...sx("text-3xl font-bold tracking-tight sm:text-4xl")}>
              {m.copy_terms_of_use()}
            </h1>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div {...sx("mb-8 text-sm text-muted-foreground")}>
              <p>{m.copy_last_updated_april_2026()}</p>
            </div>

            <div {...sx("prose prose-neutral max-w-none mb-8")}>
              <p {...sx("text-lg text-muted-foreground")}>
                {m.copy_welcome_to_zermind_these_terms_of_use_govern_your_access_to_and()}
              </p>
            </div>

            <div {...sx("grid gap-6 sm:grid-cols-1 lg:grid-cols-2")}>
              <InfoSection
                icon={FileText}
                title={m.copy_service_description()}
                content={[
                  m.copy_zermind_is_an_open_source_ai_chat_and_mind_map_application(),
                  m.copy_provides_access_to_multiple_llm_providers_through_convex_agent_w(),
                  m.copy_enables_synchronized_chat_history_branching_and_mind_map_metadat(),
                  m.copy_supports_real_time_streaming_responses_and_collaborative_session(),
                  m.copy_supports_file_attachments_through_convex_file_storage(),
                ]}
              />

              <InfoSection
                icon={Users}
                title={m.copy_user_accounts()}
                content={[
                  m.copy_you_must_provide_accurate_account_information(),
                  m.copy_you_are_responsible_for_account_security(),
                  m.copy_one_account_per_person_or_organization(),
                  m.copy_must_be_13_years_or_older_to_use_the_service(),
                  m.copy_accounts_may_be_suspended_for_violations(),
                ]}
              />

              <InfoSection
                icon={Bot}
                title={m.copy_ai_service_usage()}
                content={[
                  m.copy_ai_responses_are_generated_by_third_party_providers(),
                  m.copy_we_do_not_guarantee_accuracy_of_ai_responses(),
                  m.copy_you_are_responsible_for_verifying_ai_generated_content(),
                  m.copy_responses_may_vary_between_different_ai_models(),
                  m.copy_service_availability_depends_on_third_party_apis(),
                ]}
              />

              <InfoSection
                icon={Key}
                title={m.copy_api_keys_byok()}
                content={[
                  m.copy_you_may_provide_your_own_api_keys_byok(),
                  m.copy_you_are_responsible_for_the_accuracy_permissions_billing_and_sec(),
                  m.copy_usage_costs_with_your_keys_are_your_responsibility(),
                  m.copy_we_are_not_liable_for_unauthorized_api_key_usage_outside_our_rea(),
                  m.copy_api_keys_are_encrypted_before_storage_and_are_never_returned_to(),
                ]}
              />

              <InfoSection
                icon={Ban}
                title={m.copy_prohibited_uses()}
                content={[
                  m.copy_illegal_activities_or_unlawful_content_generation(),
                  m.copy_harassment_hate_speech_abuse_or_harmful_content(),
                  m.copy_uploading_malicious_files_or_content_that_infringes_others_right(),
                  m.copy_spamming_scraping_credential_abuse_or_automated_misuse(),
                  m.copy_attempting_to_bypass_security_controls_or_disrupt_the_service(),
                  m.copy_violating_third_party_ai_provider_terms(),
                ]}
              />

              <InfoSection
                icon={Shield}
                title={m.copy_content_privacy()}
                content={[
                  m.copy_you_retain_ownership_of_your_prompts_chats_uploads_and_generated(),
                  m.copy_you_grant_us_the_limited_rights_needed_to_operate_store_transmit(),
                  m.copy_shared_chats_become_publicly_accessible_to_anyone_with_the_share(),
                  m.copy_we_do_not_train_ai_models_on_your_data(),
                  m.copy_your_data_is_processed_according_to_our_privacy_policy(),
                  m.copy_you_can_delete_your_content_from_the_app_subject_to_provider_and(),
                ]}
              />

              <InfoSection
                icon={AlertTriangle}
                title={m.copy_disclaimers()}
                content={[
                  m.copy_service_provided_as_is_without_warranties(),
                  m.copy_no_guarantee_of_uninterrupted_availability_or_permanent_storage(),
                  m.copy_ai_responses_may_contain_inaccuracies_unsafe_suggestions_or_bias(),
                  m.copy_third_party_service_dependencies_including_convex_vercel_and_ai(),
                  m.copy_uploaded_files_and_ai_outputs_should_be_reviewed_before_relying(),
                  m.copy_open_source_nature_means_community_contributions_may_evolve_the(),
                ]}
              />

              <InfoSection
                icon={Gavel}
                title={m.copy_limitation_of_liability()}
                content={[
                  m.copy_our_liability_is_limited_to_the_maximum_extent_permitted_by_law(),
                  m.copy_not_liable_for_indirect_or_consequential_damages(),
                  m.copy_no_liability_for_third_party_ai_provider_actions(),
                  m.copy_your_use_of_ai_responses_is_at_your_own_risk(),
                  m.copy_total_liability_limited_to_service_fees_paid_if_any(),
                ]}
              />

              <InfoSection
                icon={RefreshCw}
                title={m.copy_service_changes()}
                content={[
                  m.copy_we_may_modify_limit_or_discontinue_features(),
                  m.copy_terms_may_be_updated_with_notice_where_required(),
                  m.copy_new_features_providers_collaboration_tools_or_storage_features_m(),
                  m.copy_open_source_nature_allows_community_forks_subject_to_the_project(),
                  m.copy_breaking_changes_will_be_communicated_when_reasonably_possible(),
                ]}
              />
            </div>

            <div {...sx("mt-8 border-t pt-6 text-sm text-muted-foreground space-y-4")}>
              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_open_source_license()}</h2>
                <p>
                  {m.copy_zermind_is_licensed_under_the_mit_license_the_source_code_is_ava()}{" "}
                  <a
                    href="https://github.com/okikeSolutions/zermind"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_github()}
                  </a>
                  . You may fork, modify, and distribute the code under the license terms.
                </p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_third_party_services()}</h2>
                <p>{m.copy_zermind_integrates_with_services_including_convex_vercel_better()}</p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_governing_law()}</h2>
                <p>{m.copy_these_terms_are_governed_by_austrian_law_disputes_will_be_resolv()}</p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_contact_information()}</h2>
                <p>
                  {m.copy_for_questions_about_these_terms_contact_us_at()}{" "}
                  <a
                    href="mailto:info@okike-solutions.com"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_info_okike_solutions_com()}
                  </a>
                  . See our{" "}
                  <Link
                    href="/imprint"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_imprint()}
                  </Link>{" "}
                  {m.copy_for_full_contact_details()}
                </p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_severability()}</h2>
                <p>{m.copy_if_any_provision_of_these_terms_is_found_unenforceable_the_remai()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
