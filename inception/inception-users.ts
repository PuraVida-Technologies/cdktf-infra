import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";
import { Construct } from "constructs";
import { BastionInceptionRoles } from "./inception-roles";
import { BastionVariables } from "./variables";
import { BastionPlatformRoles } from "./platform-roles";

export class BastionInceptionUsers extends Construct {
  public inceptionMakeMember: ProjectIamMember;
  public inceptionDestroyMember: ProjectIamMember;

  constructor(
    scope: Construct,
    id: string,
    vars: BastionVariables,
    inceptionRoles: BastionInceptionRoles,
    platformRoles: BastionPlatformRoles
  ) {
    super(scope, id);

    this.inceptionMakeMember = new ProjectIamMember(this, "inception_make", {
      project: vars.project,
      role: inceptionRoles.inceptionMakeRole.roleId,
      member: `serviceAccount:${vars.inceptionSaEmail}`,
    });

    this.inceptionDestroyMember = new ProjectIamMember(this, "inception_destroy", {
      project: vars.project,
      role: inceptionRoles.inceptionDestroyRole.roleId,
      member: `serviceAccount:${vars.inceptionSaEmail}`,
    });

    new ProjectIamMember(this, "inception_platform_make", {
      project: vars.project,
      role: platformRoles.platformMake.roleId,
      member: `serviceAccount:${vars.inceptionSaEmail}`,
    });

    new ProjectIamMember(this, "inception_platform_destroy", {
      project: vars.project,
      role: platformRoles.platformDestroy.roleId,
      member: `serviceAccount:${vars.inceptionSaEmail}`,
    });

    new ProjectIamMember(this, "inception_container_admin", {
      project: vars.project,
      role: "roles/container.admin",
      member: `serviceAccount:${vars.inceptionSaEmail}`,
    });
  }
}
