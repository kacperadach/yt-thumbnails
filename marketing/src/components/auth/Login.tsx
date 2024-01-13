import { Box, Container, Flex } from "@radix-ui/themes";
import { supabase } from "../../lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-shared";
import SimpleThumbnail from "../../logo.png";

export default function Login() {
  return (
    <Flex align="center" justify="center" className="my-8">
      <Box className="rounded-xl shadow-lg p-4">
        <Flex align="center" justify="center">
          <img src={SimpleThumbnail} alt="SimpleThumbnail" className="w-32 " />
        </Flex>
        <Flex align="center" justify="center" className="my-2">
          <h2>Sign in to SimpleThumbnail</h2>
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
        <Flex>
          <div>test</div>
          <a>Privacy Policy</a>
        </Flex>
      </Box>
    </Flex>
  );
}
