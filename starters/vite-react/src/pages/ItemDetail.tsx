import { Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DescriptionList,
  DescriptionTerm,
  DescriptionDetail,
  Tag,
} from "@diametral/design-system/react";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const properties = [
    { term: "ID", desc: id },
    { term: "Owner", desc: "Vincent" },
    { term: "Status", desc: <Tag tone="success">active</Tag> },
    { term: "Created", desc: "2026-01-04" },
    { term: "Updated", desc: "2026-06-18" },
  ];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/items">Items</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`Item ${id}`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader>
        <PageHeaderHeading>
          <div className="ds-flex ds-flex-col ds-gap-1">
            <PageHeaderTitle>{`Item ${id}`}</PageHeaderTitle>
            <PageHeaderDescription>Detail view reached from the grid.</PageHeaderDescription>
          </div>
          <PageHeaderActions>
            <Button onClick={() => navigate("/items")}>Back to items</Button>
          </PageHeaderActions>
        </PageHeaderHeading>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            {properties.map(({ term, desc }) => (
              <Fragment key={term}>
                <DescriptionTerm>{term}</DescriptionTerm>
                <DescriptionDetail>{desc}</DescriptionDetail>
              </Fragment>
            ))}
          </DescriptionList>
        </CardContent>
      </Card>
    </>
  );
}
