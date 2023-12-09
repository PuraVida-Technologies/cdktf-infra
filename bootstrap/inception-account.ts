import { Construct } from "constructs";
import { BootstrapVariables } from "./variables";
import { TerraformLocal } from "cdktf";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";

export class InceptionAccount extends Construct {
  public inceptionSaName: string;
  public inceptionAccount: ServiceAccount;
  public bootstrapRole: ProjectIamCustomRole;
  public inceptionBootstrapMember: ProjectIamMember;

  constructor(scope: Construct, id: string, variables: BootstrapVariables) {
    super(scope, id);

    this.inceptionSaName = new TerraformLocal(this, "inception_sa_name", `${variables.namePrefix}-inception-tf`).expression;

    this.inceptionAccount = new ServiceAccount(this, "inception", {
      project: variables.gcpProject,
      accountId: this.inceptionSaName,
      displayName: this.inceptionSaName,
      description: `Account for running inception phase for ${variables.gcpProject}`
    });

    this.bootstrapRole = new ProjectIamCustomRole(this, "bootstrap", {
      project: variables.gcpProject,
      roleId: `${variables.namePrefix}-bootstrap`.replace('-', '_'),
      title: `Bootstrap for ${variables.namePrefix}`,
      description: "Role for bootstrapping inception tf files",
      permissions: [
        "iam.serviceAccounts.actAs",
        "iam.serviceAccounts.create",
        "iam.serviceAccounts.get",
        "iam.serviceAccounts.getIamPolicy",
        "iam.serviceAccounts.setIamPolicy",
        "compute.instances.getIamPolicy",
        "compute.instances.setIamPolicy",
        "iam.roles.create",
        "iam.roles.get",
        "iam.roles.update",
        "iam.roles.undelete",
        "iam.roles.delete",
        "storage.buckets.get",
        "compute.projects.get",
        "compute.addresses.delete",
        "compute.firewalls.delete",
        "compute.instances.delete",
        "compute.instances.deleteAccessConfig",
        "compute.networks.delete",
        "compute.subnetworks.delete",
        "iam.serviceAccounts.delete",
        "iam.roles.delete",
        "storage.buckets.delete",
        "resourcemanager.projects.getIamPolicy",
        "resourcemanager.projects.setIamPolicy",
      ],
    });

    this.inceptionBootstrapMember = new ProjectIamMember(this, "inception_bootstrap", {
      project: variables.gcpProject,
      role: this.bootstrapRole.roleId,
      member: `serviceAccount:${this.inceptionAccount.email}`,
    });
  }
}
