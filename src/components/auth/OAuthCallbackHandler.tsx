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

    const hash = location.hash?.startsWith("#") ? location.hash.slice(1) : "";
    const hashParams = new URLSearchParams(hash);

    const hashError = hashParams.get("error_description") ?? hashParams.get("error");
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    // Nothing to process
    if (!code && !accessToken && !hashError) return;

    // Prevent double processing (React strict mode / rerenders)
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      // If provider returned an error in the URL hash
      if (hashError) {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState({}, document.title, url.pathname + url.search);

        toast({
          title: "Login failed",
          description: decodeURIComponent(hashError),
          variant: "destructive",
        });
        return;
      }

      // PKCE flow: Supabase redirects back with ?code=...
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

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
        return;
      }

      // Implicit flow: tokens come back in the hash fragment
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState({}, document.title, url.pathname + url.search);

        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    })();
  }, [location.search, location.hash, toast]);

  return null;
}
