import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role";
import { BastionVariables } from "./variables";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import { Construct } from "constructs";
import { TerraformIterator } from "cdktf";

export class BastionAccessRole extends Construct {
  public bastionAccessRole: ProjectIamCustomRole;
  public bastionAccessMember: ProjectIamMember;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    this.bastionAccessRole = new ProjectIamCustomRole(this, "bastion_access", {
      project: vars.project,
      roleId: `${vars.namePrefix}-bastion-access`.replace(/-/g, "_"),
      title: "Bastion Access",
      description: "Role for bastion access",
      permissions: [
        "compute.projects.get",
        "compute.instances.list",
        "iap.tunnelInstances.accessViaIAP"
      ],
    });

    const bastionSaIterator = TerraformIterator.fromList(vars.bastionUsers);

    this.bastionAccessMember = new ProjectIamMember(this, "bastion_access_member", {
      forEach: bastionSaIterator,
      project: vars.project,
      role: this.bastionAccessRole.roleId,
      member: bastionSaIterator.key
    });
  }
}
