import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "@/lib/navigation";
import {
  Shield,
  Database,
  Cookie,
  Eye,
  Users,
  Lock,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";
import InfoSection from "@/components/info-section";
import { sx } from "@/styles/sx";

import * as m from "@/paraglide/messages.js";
export default function PrivacyPolicy() {
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
              {m.copy_privacy_policy()}
            </h1>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div {...sx("mb-8 text-sm text-muted-foreground")}>
              <p>{m.copy_last_updated_april_2026()}</p>
            </div>

            <div {...sx("prose prose-neutral max-w-none mb-8")}>
              <p {...sx("text-lg text-muted-foreground")}>
                {m.copy_at_zermind_we_take_your_privacy_seriously_this_privacy_policy_ex()}
              </p>
            </div>

            <div {...sx("grid gap-6 sm:grid-cols-1 lg:grid-cols-2")}>
              <InfoSection
                icon={Database}
                title={m.copy_data_we_collect()}
                content={[
                  m.copy_account_information_email_address_username(),
                  m.copy_chat_messages_conversation_history_and_mind_map_metadata(),
                  m.copy_uploaded_file_attachments_and_related_metadata(),
                  m.copy_model_preferences_byok_provider_settings_and_encrypted_api_key_r(),
                  m.copy_usage_analytics_and_error_logs(),
                  m.copy_device_and_browser_information(),
                ]}
              />

              <InfoSection
                icon={Eye}
                title={m.copy_how_we_use_your_data()}
                content={[
                  m.copy_provide_and_improve_the_chat_service(),
                  m.copy_sync_your_conversations_across_devices(),
                  m.copy_authenticate_and_secure_your_account(),
                  m.copy_analyze_usage_patterns_to_enhance_the_app(),
                  m.copy_communicate_important_service_updates(),
                ]}
              />

              <InfoSection
                icon={MessageSquare}
                title={m.copy_chat_data_processing()}
                content={[
                  m.copy_messages_and_supported_attachments_are_sent_to_your_selected_ai(),
                  m.copy_conversations_are_stored_in_convex_agent_threads_with_mind_map_m(),
                  m.copy_uploaded_attachments_are_stored_in_convex_file_storage_and_refer(),
                  m.copy_shared_chats_may_be_publicly_accessible_via_share_links(),
                  m.copy_you_can_delete_individual_chats_or_your_entire_history(),
                  m.copy_we_do_not_train_ai_models_on_your_conversations(),
                ]}
              />

              <InfoSection
                icon={Shield}
                title={m.copy_data_protection()}
                content={[
                  m.copy_all_data_is_encrypted_in_transit_and_at_rest_by_our_infrastructu(),
                  m.copy_we_use_convex_better_auth_for_secure_authentication(),
                  m.copy_user_provided_api_keys_are_encrypted_before_storage_and_are_neve(),
                  m.copy_access_controls_and_monitoring_are_in_place(),
                  m.copy_regular_security_updates_and_privacy_reviews(),
                ]}
              />

              <InfoSection
                icon={Users}
                title={m.copy_third_party_services()}
                content={[
                  m.copy_convex_authentication_integration_database_file_storage_and_real(),
                  m.copy_better_auth_account_authentication_flows(),
                  m.copy_vercel_hosting_and_deployment(),
                  m.copy_ai_providers_selected_by_you_including_openai_anthropic_google_a(),
                  m.copy_analytics_services_where_enabled_using_limited_or_anonymized_usa(),
                ]}
              />

              <InfoSection
                icon={Cookie}
                title={m.copy_cookies_storage()}
                content={[
                  m.copy_essential_cookies_for_authentication(),
                  m.copy_local_storage_for_app_preferences(),
                  m.copy_session_tokens_for_secure_access(),
                  m.copy_no_tracking_cookies_or_ads(),
                  m.copy_you_can_clear_browser_data_anytime(),
                ]}
              />

              <InfoSection
                icon={Globe}
                title={m.copy_data_sharing()}
                content={[
                  m.copy_we_never_sell_your_personal_data(),
                  m.copy_shared_chats_are_public_by_design(),
                  m.copy_ai_providers_process_your_messages_for_responses(),
                  m.copy_we_may_share_anonymized_analytics(),
                  m.copy_legal_compliance_when_required_by_law(),
                ]}
              />

              <InfoSection
                icon={Lock}
                title={m.copy_your_rights()}
                content={[
                  m.copy_access_and_download_your_data(),
                  m.copy_delete_your_account_and_all_data(),
                  m.copy_modify_your_personal_information(),
                  m.copy_opt_out_of_analytics_collection(),
                  m.copy_request_data_portability(),
                ]}
              />

              <InfoSection
                icon={AlertCircle}
                title={m.copy_data_retention()}
                content={[
                  m.copy_account_data_until_account_deletion(),
                  m.copy_chat_history_and_agent_threads_until_manually_deleted_or_account(),
                  m.copy_uploaded_files_until_the_related_chat_file_or_account_is_deleted(),
                  m.copy_shared_chats_until_share_link_is_revoked_or_the_chat_is_deleted(),
                  m.copy_analytics_and_security_logs_retained_only_as_needed_for_service(),
                ]}
              />
            </div>

            <div {...sx("mt-8 border-t pt-6 text-sm text-muted-foreground space-y-4")}>
              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>
                  {m.copy_open_source_transparency()}
                </h2>
                <p>
                  {m.copy_zermind_is_open_source_under_the_mit_license_you_can_review_our()}{" "}
                  <a
                    href="https://github.com/okikeSolutions/zermind"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_github()}
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>{m.copy_contact_us()}</h2>
                <p>
                  {m.copy_for_privacy_questions_or_data_requests_contact_us_at()}{" "}
                  <a
                    href="mailto:info@okike-solutions.com"
                    {...sx("text-primary hover:text-primary/80 transition-colors")}
                  >
                    {m.copy_info_okike_solutions_com()}
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 {...sx("font-semibold text-primary mb-2")}>
                  {m.copy_changes_to_this_policy()}
                </h2>
                <p>{m.copy_we_may_update_this_privacy_policy_periodically_significant_chang()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
