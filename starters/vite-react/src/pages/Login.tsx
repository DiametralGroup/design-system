import { useState } from "react";
import {
  Wordmark,
  Card,
  Field,
  FieldLabel,
  Input,
  Button,
  SectionHeading,
} from "@diametral/design-system/react";

export default function Login({ onSignIn }: { onSignIn: () => void }) {
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Stand-in for a real auth call.
    setTimeout(onSignIn, 500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <form onSubmit={submit} style={{ width: "360px", maxWidth: "100%" }}>
        <Card>
          <div style={{ marginBottom: "18px" }}>
            <Wordmark variant="square" name="Diametral" sub="Starter" />
          </div>
          <SectionHeading as="h1">Sign in</SectionHeading>
          <p style={{ margin: "4px 0 20px", color: "var(--ds-ink-faint)" }}>
            Welcome back. Any credentials work in this starter.
          </p>
          <div style={{ display: "grid", gap: "14px" }}>
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input id="login-email" type="email" defaultValue="you@diametral.io" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input id="login-password" type="password" defaultValue="password" required />
            </Field>
            <Button variant="primary" block loading={loading} type="submit">
              Sign in
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
