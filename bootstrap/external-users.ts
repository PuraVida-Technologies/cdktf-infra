import { OrganizationIamMember } from "@cdktf/provider-google/lib/organization-iam-member";
import { Construct } from "constructs";
import { BootstrapVariables } from "./variables";
import { TerraformIterator } from "cdktf";

export class ExternalUsers extends Construct {
  externalUsers: OrganizationIamMember;

  constructor(scope: Construct, id: string, variables: BootstrapVariables) {
    super(scope, id);

    const externalUsers = TerraformIterator.fromList(variables.externalUsers);

    this.externalUsers = new OrganizationIamMember(this, "external_users", {
      forEach: variables.organizationId !== "" ? externalUsers : TerraformIterator.fromList([]),
      orgId: variables.organizationId,
      role: "roles/computer.osLoginExternalUser",
      member: "user:${each.value}"
    })
  }
}
