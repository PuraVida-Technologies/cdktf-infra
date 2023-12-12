import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { BootstrapVariables } from "./bootstrap/variables";
import { StateBucket } from "./bootstrap/state-bucket";
import { InceptionAccount } from "./bootstrap/inception-account";
import { ExternalUsers } from "./bootstrap/external-users";
import { Services } from "./bootstrap/services";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { Bastion } from "./inception/bastion";
import { BastionVariables } from "./inception/variables";
import { BastionPlatformRoles } from "./inception/platform-roles";
import { BastionNetwork } from "./inception/network";
import { BastionServiceAccount } from "./inception/service-account";
import { BastionAncillaryUsers } from "./inception/ancillary-users";
import { BastionAncillaryRoles } from "./inception/ancillary-roles";
import { BastionPlatformUsers } from "./inception/platform-users";
import { BastionNodeAccount } from "./inception/node-account";
import { BastionAccessRole } from "./inception/bastion-access-role";
import { InceptionSetup } from "./inception/setup";

class PuraVidaStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      region: "us-east1",
    });

    this.ship();
  }

  ship() {
    const { bootstrapVars } = this.bootstrap();
    this.bastion(bootstrapVars);
  }

  bastion(bootstrapVars: BootstrapVariables) {
    const bastionVars = new BastionVariables(this, "bastion_vars", bootstrapVars);

    const nodeAccount = new BastionNodeAccount(this, "bastion_node_account", bastionVars);
    const platformRoles = new BastionPlatformRoles(this, "platform_roles", bastionVars);
    new BastionPlatformUsers(this, "platform_users", bastionVars, platformRoles, nodeAccount);

    const network = new BastionNetwork(this, "network", bastionVars, platformRoles);
    const serviceAccount = new BastionServiceAccount(this, "service_account", bastionVars);

    new InceptionSetup(this, "inception_setup", bastionVars, serviceAccount, platformRoles, network);

    new Bastion(this, "bastion_main", bastionVars, network, serviceAccount);
    new BastionAccessRole(this, "bastion_access_role", bastionVars);

    // todo: should we generate ancillary users/roles if there are none, or no?
    if (bastionVars.ancillaryUsers.length) {
      new BastionAncillaryUsers(this, "ancillary_users", bastionVars);
      new BastionAncillaryRoles(this, "ancillary_roles", bastionVars);
    }
  }

  bootstrap() {
    const bootstrapVars = new BootstrapVariables(this, "bootstrap_vars");

    const inceptionAccount = new InceptionAccount(
      this,
      "inception_account",
      bootstrapVars
    );
    new StateBucket(
      this,
      "state_bucket",
      bootstrapVars,
      inceptionAccount
    );
    new ExternalUsers(this, "external_users", bootstrapVars);
    new Services(this, "services", bootstrapVars);

    return {
      bootstrapVars,
    };
  }
}

const app = new App();
new PuraVidaStack(app, "cdktf-poc");
app.synth();
