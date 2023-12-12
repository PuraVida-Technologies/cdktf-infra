import { Construct } from "constructs";
import { BootstrapVariables } from "../bootstrap/variables";
import { TerraformVariable } from "cdktf";

export interface User {
  id: string;
  bastion: boolean;
  inception: boolean;
  platform: boolean;
  logs: boolean;
  ancillary: boolean;
}

export class BastionVariables extends Construct {
  public namePrefix: string;
  public project: string;
  public region = "us-east1";
  public primaryZone = "b";
  public clusterZone = "";

  public bastionMachineType = "e2-micro";
  public bastionImage = "ubuntu-os-cloud/ubuntu-2204-lts";
  public bastionRevokeOnExit = true;

  public networkPrefix = "10.0";
  public objectsListRoleName = "objects-list";

  public inceptionSaEmail: string;

  public stateBucketName: string;
  public stateBucketLocation: string;
  public stateBucketPolicy: string;

  public users: User[] = [
    {
      id: "user:luke@puravidabitcoin.io",
      inception: true,
      platform: true,
      logs: true,
      bastion: true,
      ancillary: false,
    },
    {
      id: "user:pgovinda@puravidabitcoin.io",
      inception: true,
      platform: true,
      logs: true,
      bastion: true,
      ancillary: false,
    },
  ];

  public logViewers: string[];
  public inceptionAdmins: string[];
  public platformAdmins: string[];
  public bastionUsers: string[];
  public ancillaryUsers: string[];

  public bastionZone: string;

  constructor(scope: Construct, id: string, bootstrapVars: BootstrapVariables) {
    super(scope, id);

    this.namePrefix = bootstrapVars.namePrefix;
    this.project = bootstrapVars.gcpProject;

    this.inceptionSaEmail = new TerraformVariable(this, "inception_sa_email", {
      type: "string",
      default: "",
    }).value;

    this.stateBucketName = new TerraformVariable(this, "tf_state_bucket_name", {
      type: "string",
      default: "",
    }).value;

    this.stateBucketLocation = new TerraformVariable(this, "buckets_location", {
      type: "string",
      default: "",
    }).value;

    this.stateBucketPolicy = new TerraformVariable(
      this,
      "tf_state_bucket_policy",
      {
        type: "string",
        default: "",
      }
    ).value;

    this.logViewers = this.users
      .filter((user) => user.logs)
      .map((user) => {
        return user.id;
      });

    this.inceptionAdmins = this.users
      .filter((user) => user.inception)
      .map((user) => {
        return user.id;
      });

    this.platformAdmins = [
      ...this.users
        .filter((user) => user.platform)
        .map((user) => {
          return user.id;
        }),
      `serviceAccount:${this.inceptionSaEmail}`,
    ];

    this.bastionUsers = [
      ...this.users
        .filter((user) => user.bastion)
        .map((user) => {
          return user.id;
        }),
      ...this.platformAdmins,
    ];

    this.ancillaryUsers = this.users.filter((user) => user.ancillary).map((user) => {
      return user.id;
    });

    const objectsListRoleNameVar = new TerraformVariable(this, "objects_list_role_name", {
      type: "string",
      default: "",
    }).value;

    this.objectsListRoleName = `${this.namePrefix}-${objectsListRoleNameVar}`.replace('-', '_');

    const clusterZoneVar = new TerraformVariable(this, "cluster_zone", {
      type: "string",
      default: "",
    }).value;

    this.clusterZone = clusterZoneVar == "" ? this.region : `${this.region}-${clusterZoneVar}`;

    this.bastionZone = `${this.region}-${this.primaryZone}`
  }
}
