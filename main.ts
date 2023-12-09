import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { BootstrapVariables } from "./bootstrap/variables";
import { StateBucket } from "./bootstrap/state-bucket";
import { InceptionAccount } from "./bootstrap/inception-account";
import { ExternalUsers } from "./bootstrap/external-users";
import { Services } from "./bootstrap/services";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      region: "us-east1",
    });

    this.bootstrap();
  }

  bootstrap() {
    const bootstrapVars = new BootstrapVariables(this, "bootstrap_vars");

    const inceptionAccount = new InceptionAccount(this, "inception_account", bootstrapVars);
    new StateBucket(this, "state_bucket", bootstrapVars, inceptionAccount);
    new ExternalUsers(this, "external_users", bootstrapVars);
    new Services(this, "services", bootstrapVars);
  }
}

const app = new App();
new MyStack(app, "cdktf-poc");
app.synth();
