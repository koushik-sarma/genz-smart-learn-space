import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Processes Supabase OAuth redirects (implicit hash or PKCE code) and stores the session.
 * Must be rendered inside a Router.
 */
export function OAuthCallbackHandler() {
  const location = useLocation();
  const { toast } = useToast();
  const ranRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    // For PKCE flows, Supabase redirects back with ?code=...
    if (!code) return;

    // Prevent double processing (React strict mode / rerenders)
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      // Clean up URL so router/users don't see auth params in the address bar
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      url.hash = "";
      window.history.replaceState({}, document.title, url.pathname + url.search);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    })();
  }, [location.search, toast]);

  return null;
}
