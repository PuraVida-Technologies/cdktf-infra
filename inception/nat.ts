import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ComputeRouter } from "@cdktf/provider-google/lib/compute-router";
import { BastionNetwork } from "./network";
import { ComputeRouterNat } from "@cdktf/provider-google/lib/compute-router-nat";
import { BastionInceptionRoles } from "./inception-roles";
import { BastionInceptionUsers } from "./inception-users";

export class BastionNat extends Construct {
  public computeRouter: ComputeRouter;
  public computeRouterNat: ComputeRouterNat;

  constructor(scope: Construct, id: string, vars: BastionVariables, network: BastionNetwork, roles: BastionInceptionRoles, users: BastionInceptionUsers) {
    super(scope, id);

    this.computeRouter = new ComputeRouter(this, "router", {
      name: `${vars.namePrefix}-router`,
      project: vars.project,
      region: vars.region,
      network: network.vpc.selfLink,
      bgp: {
        asn: 64514,
      }
    });

    this.computeRouterNat = new ComputeRouterNat(this, "main", {
      name: `${vars.namePrefix}-nat`,
      project: vars.project,
      region: vars.region,
      router: this.computeRouter.name,
      natIpAllocateOption: "AUTO_ONLY",
      sourceSubnetworkIpRangesToNat: "ALL_SUBNETWORKS_ALL_IP_RANGES",
      dependsOn: [
        roles.inceptionMakeRole,
        roles.inceptionDestroyRole,
        users.inceptionMakeMember,
        users.inceptionDestroyMember,
      ],
    });

  }
}
