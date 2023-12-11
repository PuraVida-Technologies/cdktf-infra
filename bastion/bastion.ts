import { ComputeFirewall } from "@cdktf/provider-google/lib/compute-firewall";
import { ComputeInstance } from "@cdktf/provider-google/lib/compute-instance";
import { ComputeInstanceIamPolicy } from "@cdktf/provider-google/lib/compute-instance-iam-policy";
import { ComputeNetwork } from "@cdktf/provider-google/lib/compute-network";
import { ComputeSubnetwork } from "@cdktf/provider-google/lib/compute-subnetwork";
import { DataGoogleIamPolicy } from "@cdktf/provider-google/lib/data-google-iam-policy";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { Fn } from "cdktf";
import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { BastionNetwork } from "./network";
import { BastionServiceAccount } from "./service-account";

export interface BastionProps {
  namePrefix: string;
  project: string;
  computeNetwork: ComputeNetwork;
  bastionImage: string;
  bastionMachineType: string;
  bastionZone: string;
  bastionSa: ServiceAccount;
  dmz: ComputeSubnetwork;
  clusterZone: string;
  bastionRevokeOnExit: boolean;
  bastionUsers: string[];
  vpcNetwork: ComputeNetwork;
}

export class Bastion extends Construct {
  public tag: string;

  public cfssl_version   = "1.6.1"
  public bitcoin_version = "24.0.1"
  public cepler_version  = "0.7.9"
  public safe_version    = "1.7.0"
  public lnd_version     = "0.15.5"
  public kubectl_version = "1.23.5"
  public k9s_version     = "0.25.18"
  public bos_version     = "12.13.3"
  public kratos_version  = "0.11.1"

  public bastionComputeInstance: ComputeInstance;
  public bastionFirewall: ComputeFirewall;
  public computeInstanceIamPolicy: ComputeInstanceIamPolicy;

  constructor(scope: Construct, id: string, vars: BastionVariables, network: BastionNetwork, serviceAccount: BastionServiceAccount) {
    super(scope, id);

    this.tag = `${vars.namePrefix}-bastion`;

    this.bastionComputeInstance = new ComputeInstance(this, "bastion_compute", {
      project: vars.project,
      name: `${vars.namePrefix}-bastion`,
      machineType: vars.bastionMachineType,
      zone: vars.bastionZone,
      serviceAccount: {
        email: serviceAccount.serviceAccount.email,
        scopes: [
          "https://www.googleapis.com/auth/cloud-platform",
        ]
      },
      tags: [this.tag],
      bootDisk: {
        initializeParams: {
          image: vars.bastionImage,
        }
      },
      networkInterface: [{
        subnetwork: network.dmz.selfLink,
      }],
      metadata: {
        "enable-oslogin": "TRUE",
        "enable-oslogin-2fa": "TRUE",
      },
      metadataStartupScript: Fn.templatefile("./bastion-startup.tmpl", {
        cluster_name: `${vars.namePrefix}-cluster`,
        zone: vars.clusterZone,
        project: vars.project,
        bastion_revoke_on_exit: vars.bastionRevokeOnExit,
        cfssl_version: this.cfssl_version,
        bitcoin_version: this.bitcoin_version,
        cepler_version: this.cepler_version,
        safe_version: this.safe_version,
        lnd_version: this.lnd_version,
        kubectl_version: this.kubectl_version,
        k9s_version: this.k9s_version,
        bos_version: this.bos_version,
        kratos_version: this.kratos_version,
      }),
    }); 

    const bastionIamPolicy = new DataGoogleIamPolicy(this, "bastion_iam_policy", {
      binding: [
        {
          role: "roles/compute.osLogin",
          members: vars.bastionUsers,
        },
        {
          role: "roles/compute.viewer",
          members: vars.bastionUsers,
        },
        { 
          role: "roles/compute.admin",
          members: ["serviceAccount:" + serviceAccount.serviceAccount.email],
        },
      ],
    });

    this.computeInstanceIamPolicy = new ComputeInstanceIamPolicy(this, "bastion_compute_policy", {
      project: vars.project,
      zone: this.bastionComputeInstance.zone,
      instanceName: this.bastionComputeInstance.name,
      policyData: bastionIamPolicy.policyData,
    });

    this.bastionFirewall = new ComputeFirewall(this, "bastion_allow_iap_inbound", {
      project: vars.project,
      name: `${vars.namePrefix}-bastion-allow-iap-ingress`,
      network: network.vpc.selfLink,
      targetTags: [this.tag],
      direction: "INGRESS",
      sourceRanges: ["35.235.240.0/20"],
      priority: 1000,
      allow: [{
        protocol: "tcp",
        ports: ["22"],
      }],
    });
  }
}
