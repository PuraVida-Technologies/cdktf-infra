import { ServiceAccountKey } from "@cdktf/provider-google/lib/service-account-key";
import { GcsBackend } from "cdktf";
import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { BastionInceptionRoles } from "./inception-roles";
import { BastionInceptionUsers } from "./inception-users";
import { BastionPlatformRoles } from "./platform-roles";
import { BastionNetwork } from "./network";
import { BastionNat } from "./nat";
import { BastionServiceAccount } from "./service-account";

export class InceptionSetup extends Construct {
  public gcsBackend: GcsBackend;

  constructor(
    scope: Construct,
    id: string,
    vars: BastionVariables,
    inceptionAccount: BastionServiceAccount,
    platformRoles: BastionPlatformRoles,
    network: BastionNetwork
  ) {
    super(scope, id);

    const inceptionAccountKey = new ServiceAccountKey(this, "inception_account_key", {
      serviceAccountId: inceptionAccount.serviceAccount.id,
      privateKeyType: "TYPE_GOOGLE_CREDENTIALS_FILE",
    });

    this.gcsBackend = new GcsBackend(this, {
      bucket: vars.stateBucketName,
      prefix: `${vars.namePrefix}/inception`,
      credentials: inceptionAccountKey.privateKey,
    });

    if (vars.inceptionAdmins.length) {
      const inceptionRoles = new BastionInceptionRoles(this, "inception_roles", vars);
      const inceptionUsers = new BastionInceptionUsers(this, "inception_users", vars, inceptionRoles, platformRoles);

      new BastionNat(this, "bastion_nat", vars, network, inceptionRoles, inceptionUsers);
    }
  }
}
