import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { BastionPlatformRoles } from "./platform-roles";
import { TerraformIterator } from "cdktf";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import { ServiceAccountIamMember } from "@cdktf/provider-google/lib/service-account-iam-member";
import { BastionNodeAccount } from "./node-account";

export class BastionPlatformUsers extends Construct {
  constructor(scope: Construct, id: string, vars: BastionVariables, roles: BastionPlatformRoles, nodeAccount: BastionNodeAccount) {
    super(scope, id);

    const bastionPlatformAdmins = TerraformIterator.fromList(vars.platformAdmins);

    new ProjectIamMember(this, "platform_make", {
      forEach: bastionPlatformAdmins,
      project: vars.project,
      role: roles.platformMake.roleId,
      member: bastionPlatformAdmins.key,
    });
    
    new ProjectIamMember(this, "platform_destroy", {
      forEach: bastionPlatformAdmins,
      project: vars.project,
      role: roles.platformDestroy.roleId,
      member: bastionPlatformAdmins.key,
    });

    new ProjectIamMember(this, "container_admin", {
      forEach: bastionPlatformAdmins,
      project: vars.project,
      role: "roles/container.admin",
      member: bastionPlatformAdmins.key,
    });

    new ServiceAccountIamMember(this, "nodes_account_iam", {
      forEach: bastionPlatformAdmins,
      serviceAccountId: nodeAccount.clusterServiceAccount.id,
      role: "roles/iam.serviceAccountUser",
      member: bastionPlatformAdmins.key,
    });
  }
}
