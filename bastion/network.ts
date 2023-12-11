import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ComputeNetwork } from "@cdktf/provider-google/lib/compute-network";
import { ComputeSubnetwork } from "@cdktf/provider-google/lib/compute-subnetwork";
import { ComputeGlobalAddress } from "@cdktf/provider-google/lib/compute-global-address";
import { BastionPlatformRoles } from "./platform-roles";

export class BastionNetwork extends Construct {
  public vpc: ComputeNetwork;
  public dmz: ComputeSubnetwork;
  public peeringGlobalAddress: ComputeGlobalAddress;

  constructor(
    scope: Construct,
    id: string,
    vars: BastionVariables,
    roles: BastionPlatformRoles,
  ) {
    super(scope, id);

    this.vpc = new ComputeNetwork(this, "vpc", {
      project: vars.project,
      name: `${vars.namePrefix}-vpc`,
      autoCreateSubnetworks: false,
      routingMode: "REGIONAL",
    });

    this.dmz = new ComputeSubnetwork(this, "dmz", {
      project: vars.project,
      region: vars.region,
      name: `${vars.namePrefix}-dmz`,
      network: this.vpc.selfLink,
      privateIpGoogleAccess: true,
      ipCidrRange: `${vars.networkPrefix}.0.0/16`,
    });

    this.peeringGlobalAddress = new ComputeGlobalAddress(this, "peering", {
      project: vars.project,
      name: `${vars.namePrefix}-peering`,
      purpose: "VPC_PEERING",
      addressType: "INTERNAL",
      prefixLength: 16,
      network: this.vpc.id,
      dependsOn: [roles.platformMake, roles.platformDestroy],
    });
  }
}
