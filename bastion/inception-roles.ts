import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role";

export class BastionInceptionRoles extends Construct {
  public inceptionMakeRole: ProjectIamCustomRole;
  public inceptionDestroyRole: ProjectIamCustomRole;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    this.inceptionMakeRole = new ProjectIamCustomRole(this, "inception_make", {
      project: vars.project,
      roleId: `${vars.namePrefix}-inception-make`.replace(/-/g, "_"),
      title: "Create Inception",
      description: `Role for executing inception TF files for ${vars.namePrefix}`,
      permissions: [
        "compute.addresses.create",
        "compute.addresses.createInternal",
        "compute.addresses.get",
        "compute.addresses.use",
        "compute.disks.create",
        "compute.firewalls.create",
        "compute.firewalls.get",
        "compute.instances.addAccessConfig",
        "compute.instances.create",
        "compute.instances.get",
        "compute.instances.setMetadata",
        "compute.instances.setServiceAccount",
        "compute.instances.setTags",
        "compute.instances.getIamPolicy",
        "compute.instances.setIamPolicy",
        "compute.routers.get",
        "compute.routers.create",
        "compute.routers.update",
        "compute.networks.create",
        "compute.networks.get",
        "compute.networks.updatePolicy",
        "compute.subnetworks.create",
        "compute.subnetworks.get",
        "compute.subnetworks.use",
        "compute.subnetworks.useExternalIp",
        "compute.zones.get",
        "iam.serviceAccounts.actAs",
        "iam.serviceAccounts.create",
        "iam.serviceAccounts.get",
        "iam.serviceAccounts.getIamPolicy",
        "iam.serviceAccounts.setIamPolicy",
        "resourcemanager.projects.getIamPolicy",
        "resourcemanager.projects.setIamPolicy",
        "storage.buckets.create",
        "storage.buckets.update",
        "storage.buckets.get",
        "storage.buckets.getIamPolicy",
        "storage.buckets.setIamPolicy",
      ],
    });

    this.inceptionDestroyRole = new ProjectIamCustomRole(this, "inception_destroy", {
      project: vars.project,
      roleId: `${vars.namePrefix}-inception-destroy`.replace(/-/g, "_"),
      title: "Destroy Inception",
      description: `Role for destroying inception environment for ${vars.namePrefix}`,
      permissions: [
        "compute.addresses.delete",
        "compute.addresses.deleteInternal",
        "compute.firewalls.delete",
        "compute.instances.delete",
        "compute.instances.deleteAccessConfig",
        "compute.routers.delete",
        "compute.networks.delete",
        "compute.subnetworks.delete",
        "iam.serviceAccounts.delete",
        "iam.roles.delete",
        "storage.buckets.delete",
      ],
    });
  }
}
