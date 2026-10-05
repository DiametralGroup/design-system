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
} from "@diametral/design-system/react"

export default function Signup01() {
  return (
    <div className="ds-block-signup-01">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent className="ds-block-signup-01__content">
          <Field>
            <FieldLabel htmlFor="signup-01-name">Name</FieldLabel>
            <Input
              id="signup-01-name"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-01-email">Email</FieldLabel>
            <Input
              id="signup-01-email"
              type="email"
              autoComplete="email"
              placeholder="you@diametral.io"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="signup-01-password">Password</FieldLabel>
            <Input
              id="signup-01-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <FieldDescription>At least 12 characters.</FieldDescription>
          </Field>
          <Button variant="primary" block>
            Create account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
