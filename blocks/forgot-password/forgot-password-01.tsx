import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
} from "@diametral/design-system/react"

export default function ForgotPassword01() {
  return (
    <div className="ds-block-forgot-password-01">
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email and we'll send a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="ds-block-forgot-password-01__content">
          <Field>
            <FieldLabel htmlFor="forgot-password-01-email">Email</FieldLabel>
            <Input
              id="forgot-password-01-email"
              type="email"
              autoComplete="email"
              placeholder="you@diametral.io"
            />
          </Field>
          <Button variant="primary" block>
            Send reset link
          </Button>
          <FieldDescription className="ds-block-forgot-password-01__hint">
            <a href="#forgot-password-01">Back to sign in</a>
          </FieldDescription>
        </CardContent>
      </Card>
    </div>
  )
}
