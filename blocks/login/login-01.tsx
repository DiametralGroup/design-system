import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Wordmark,
} from "@diametral/design-system/react"

export default function Login01() {
  return (
    <div className="ds-block-login-01">
      <Card>
        <CardHeader className="ds-block-login-01__header">
          <Wordmark variant="square" className="ds-block-login-01__mark" />
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="ds-block-login-01__content">
          <Field>
            <FieldLabel htmlFor="login-01-email">Email</FieldLabel>
            <Input
              id="login-01-email"
              type="email"
              autoComplete="email"
              placeholder="you@diametral.io"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-01-password">Password</FieldLabel>
            <Input
              id="login-01-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </Field>
          <Button variant="primary" block>
            Sign in
          </Button>
          <Button block>Continue with SSO</Button>
          <FieldDescription className="ds-block-login-01__hint">
            <a href="#login-01">Forgot your password?</a>
          </FieldDescription>
        </CardContent>
      </Card>
    </div>
  )
}
