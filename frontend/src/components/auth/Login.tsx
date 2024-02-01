import { Box, Container, Flex, Link } from "@radix-ui/themes";
import { supabase } from "../../lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-shared";
import SimpleThumbnail from "../../logo.webp";

export default function Login() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100vh",
        background:
          "linear-gradient(0deg, rgba(8,208,135,1) 0%, rgba(255,230,177,1) 100%)",
      }}
    >
      <Box className="rounded-xl shadow-lg p-4 bg-white">
        <Flex align="center" justify="center">
          <img
            src={SimpleThumbnail}
            alt="SimpleThumbnail"
            className="w-32"
            width="8rem"
            height="8rem"
          />
        </Flex>
        <Flex align="center" justify="center" className="my-2">
          <h2>
            Sign in to{" "}
            <span className="logoText" style={{ fontSize: "2rem" }}>
              SimpleThumbnail
            </span>
          </h2>
        </Flex>
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          redirectTo={window.location.origin}
          appearance={{
            theme: ThemeSupa,
            style: {
              container: {
                width: "25rem",
              },
            },
          }}
        />
        <Flex justify="center">
          <a
            className="mx-2 text-brand-green cursor-pointer"
            href={process.env.REACT_APP_TERMS_OF_SERVICE_URL}
            target="_blank"
          >
            Terms of use
          </a>
          <span>{" | "}</span>
          <a
            className="mx-2 text-brand-green cursor-pointer"
            href={process.env.REACT_APP_PRIVACY_POLICY_URL}
            target="_blank"
          >
            Privacy Policy
          </a>
        </Flex>
      </Box>
    </Flex>
  );
}
