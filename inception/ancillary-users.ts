import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { TerraformIterator } from "cdktf";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";

export class BastionAncillaryUsers extends Construct {
  public ancillaryProjectMember: ProjectIamMember;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    const ancillaryUsersIterator = TerraformIterator.fromList(vars.ancillaryUsers);

    this.ancillaryProjectMember = new ProjectIamMember(this, "ancillary_member", {
      forEach: ancillaryUsersIterator,
      project: vars.project,
      role: `projects/${vars.project}/roles/${vars.namePrefix}-ancillary-dev`,
      member: ancillaryUsersIterator.key,
    });
  

  }
}
