import { Construct } from "constructs";
import { BootstrapVariables } from "./variables";
import { TerraformIterator, TerraformLocal } from "cdktf";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";

export class Services extends Construct {
  constructor(scope: Construct, id: string, variables: BootstrapVariables) {
    super(scope, id);

    const apis = new TerraformLocal(this, "apis", [
      "iam.googleapis.com",
      "cloudresourcemanager.googleapis.com",
      "compute.googleapis.com",
      "container.googleapis.com",
      "monitoring.googleapis.com",
      "stackdriver.googleapis.com",
      "servicenetworking.googleapis.com",
      "sqladmin.googleapis.com",
      "bigqueryconnection.googleapis.com",
    ]).expression;

    const apisIterator = TerraformIterator.fromList(apis);

    new ProjectService(this, "service", {
      forEach: variables.enableServices ? apisIterator : TerraformIterator.fromList([]),
      project: variables.gcpProject,
      service: "${each.value}",
      disableOnDestroy: false,
    });
  }
}
