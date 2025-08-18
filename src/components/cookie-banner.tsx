"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the window interface to include the addConsentListener, updateConsentState, and gtag functions
declare global {
  interface Window {
    addConsentListener: (
      callback: (consent: { [key: string]: boolean }) => void
    ) => void;
    onConsentChange: (consent: { [key: string]: boolean }) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datafast: any;
  }
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setShowBanner(true);
        setDefaultConsentState();
      } else {
        // If consent was previously given, update consent state
        updateConsentState(consent === "true");
      }

      // Initialize the consentListeners array and addConsentListener function
      const consentListeners: ((consent: {
        [key: string]: boolean;
      }) => void)[] = [];
      window.addConsentListener = (callback) => {
        consentListeners.push(callback);
      };

      // Define the onConsentChange function
      function onConsentChange(consent: { [key: string]: boolean }) {
        consentListeners.forEach((callback) => {
          callback(consent);
        });
      }

      // Attach the onConsentChange function to the window for global access
      window.onConsentChange = onConsentChange;
    } catch (error) {
      console.error("Error initializing cookie consent:", error);
    }
  }, []);

  const setDefaultConsentState = () => {
    try {
      // Set default consent state for all regions
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "granted",
      });

      // Set ads_data_redaction to true when ad_storage is denied
      window.gtag("set", "ads_data_redaction", true);
    } catch (error) {
      console.error("Error setting default consent state:", error);
    }
  };

  const updateConsentState = (granted: boolean) => {
    try {
      const consentState = {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        functionality_storage: granted ? "granted" : "denied",
        personalization_storage: granted ? "granted" : "denied",
        security_storage: "granted",
      };

      window.gtag("consent", "update", consentState);

      // Set ads_data_redaction based on ad_storage consent
      window.gtag("set", "ads_data_redaction", !granted);

      // Notify listeners about the consent change
      if (window.onConsentChange) {
        window.onConsentChange({ cookieConsent: granted });
      }
    } catch (error) {
      console.error("Error updating consent state:", error);
    }
  };

  const acceptCookies = () => {
    try {
      localStorage.setItem("cookieConsent", "true");
      setShowBanner(false);
      updateConsentState(true);
    } catch (error) {
      console.error("Error accepting cookies:", error);
    }
  };

  const rejectCookies = () => {
    try {
      localStorage.setItem("cookieConsent", "false");
      setShowBanner(false);
      updateConsentState(false);
    } catch (error) {
      console.error("Error rejecting cookies:", error);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 p-4 shadow-md z-50 dark:bg-neutral-800">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-700 mb-2 sm:mb-0 dark:text-gray-300">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.{" "}
          <Link
            href="/privacy"
            className="text-rose-800 hover:text-rose-700 underline"
          >
            Learn more
          </Link>
        </p>
        <div>
          <Button onClick={rejectCookies} variant="outline" className="mr-2">
            Reject
          </Button>
          <Button onClick={acceptCookies} className="ml-0 sm:ml-4">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
