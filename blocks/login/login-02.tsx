"use client"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
  Input,
  Wordmark,
} from "@diametral/design-system/react"

/** The whole screen, not a section of one: the card is centred on the brand
 *  background and the page has no chrome around it. */
export default function Login02() {
  return (
    <div className="ds-block-login-02">
      <Card className="ds-block-login-02__card">
        <CardHeader className="ds-block-login-02__header">
          <Wordmark variant="square" className="ds-block-login-02__mark" />
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="ds-block-login-02__form"
            onSubmit={(event) => event.preventDefault()}
          >
            <Field>
              <FieldLabel htmlFor="login-02-email">Email</FieldLabel>
              <Input
                id="login-02-email"
                type="email"
                autoComplete="email"
                placeholder="you@diametral.io"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-02-password">Password</FieldLabel>
              <Input
                id="login-02-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </Field>
            <Button type="submit" variant="primary" block>
              Sign in
            </Button>
            <FieldDescription className="ds-block-login-02__hint">
              <a href="#login-02">Forgot your password?</a>
            </FieldDescription>
            <FieldSeparator>or</FieldSeparator>
            <Button type="button" block>
              Continue with SSO
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
