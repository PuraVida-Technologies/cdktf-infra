import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ServiceAccountIamMember } from "@cdktf/provider-google/lib/service-account-iam-member";
import { TerraformIterator } from "cdktf";

export class BastionServiceAccount extends Construct {
  public serviceAccount: ServiceAccount;
  public bastionAccountMember: ServiceAccountIamMember;

  constructor(scope: Construct, id: string, bastionVars: BastionVariables) {
    super(scope, id);

    this.serviceAccount = new ServiceAccount(this, "bastion", {
      project: bastionVars.project,
      accountId: `${bastionVars.namePrefix}-bastion`,
      displayName: `Bastion account for ${bastionVars.namePrefix}`,
    });

    const bastionSaIterator = TerraformIterator.fromList(bastionVars.bastionUsers);

    this.bastionAccountMember = new ServiceAccountIamMember(this, "bastion_account", {
      forEach: bastionSaIterator,
      serviceAccountId: this.serviceAccount.id,
      role: "roles/iam.serviceAccountUser",
      member: bastionSaIterator.key
    });
  }
}
