import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role";
import { Construct } from "constructs";
import { BastionVariables } from "./variables";

export class BastionAncillaryRoles extends Construct {
  public ancillaryCustomRole: ProjectIamCustomRole;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    this.ancillaryCustomRole = new ProjectIamCustomRole(this, "ancillary_custom_role", {
      project: vars.project,
      roleId: `${vars.namePrefix}-ancillary-dev`.replace(/-/g, "_"),
      title: `Ancillary Developer Permissions (${vars.namePrefix})`,
      description: `Ancillary roles for developers who work on ${vars.namePrefix}`,
      permissions: [
        "compute.addresses.get",
        "compute.addresses.list",
        "compute.firewalls.get",
        "compute.firewalls.list",
        "compute.instances.get",
        "compute.instances.getIamPolicy",
        "compute.networks.get",
        "compute.networks.list",
        "compute.subnetworks.get",
        "compute.subnetworks.list",
        "compute.zones.get",
        "compute.zones.list",
        "iam.roles.get",
        "iam.roles.list",
        "iam.serviceAccounts.get",
        "iam.serviceAccounts.getIamPolicy",
        "resourcemanager.projects.getIamPolicy",
        "storage.buckets.get",
        "storage.buckets.getIamPolicy",
        "storage.buckets.setIamPolicy",
        "storage.objects.list",
        "storage.objects.delete",
      ],
    });
      
  }
}
