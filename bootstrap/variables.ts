import { TerraformVariable } from "cdktf";
import { Construct } from "constructs";

export class BootstrapVariables extends Construct {
  public namePrefix: string;
  public gcpProject: string;
  public organizationId = "";
  public externalUsers = [];

  public stateBucketName: string;
  public stateBucketRegion: string;
  public stateBucketForceDestroy: boolean;

  public enableServices: boolean;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.namePrefix = new TerraformVariable(this, "name_prefix", {
      type: "string",
    }).value;

    this.gcpProject = new TerraformVariable(this, "gcp_project", {
      type: "string",
    }).value;

    this.organizationId = new TerraformVariable(this, "organization_id", {
      type: "string",
    }).value;

    this.externalUsers = new TerraformVariable(this, "external_users", {
      type: "list(string)",
    }).value;

    this.stateBucketName = new TerraformVariable(this, "state_bucket_name", {
      type: "string",
    }).value;

    this.stateBucketRegion = new TerraformVariable(this, "state_bucket_region", {
      type: "string",
      default: "US-EAST1",
    }).value;

    this.stateBucketForceDestroy = new TerraformVariable(
      this,
      "state_bucket_force_destroy",
      {
        type: "bool",
        default: false,
      }
    ).value;

    this.enableServices = new TerraformVariable(this, "enable_services", {
      type: "bool",
      default: true,
    }).value;
  }
}
