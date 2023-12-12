import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { ProjectIamMember } from "@cdktf/provider-google/lib/project-iam-member";

export class BastionNodeAccount extends Construct {
  public clusterServiceAccount: ServiceAccount;
  public csaLogWriter: ProjectIamMember;
  public csaMetricWriter: ProjectIamMember;
  public csaMonitoringViewer: ProjectIamMember;
  public csaResourceMetadataWriter: ProjectIamMember;
  public csaGcrAdmin: ProjectIamMember;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    this.clusterServiceAccount = new ServiceAccount(this, "cluster_service_account", {
      project: vars.project,
      accountId: `${vars.namePrefix}-cluster`,
      displayName: `${vars.namePrefix} Cluster`,
    });

    this.csaLogWriter = new ProjectIamMember(this, "cluster_service_account_log_writer", {
      project: vars.project,
      role: "roles/logging.logWriter",
      member: `serviceAccount:${this.clusterServiceAccount.email}`,
    });

    this.csaMetricWriter = new ProjectIamMember(this, "cluster_service_account_metric_writer", {
      project: vars.project,
      role: "roles/monitoring.metricWriter",
      member: `serviceAccount:${this.clusterServiceAccount.email}`,
    });

    this.csaMonitoringViewer = new ProjectIamMember(this, "cluster_service_account_monitoring_viewer", {
      project: vars.project,
      role: "roles/monitoring.viewer",
      member: `serviceAccount:${this.clusterServiceAccount.email}`,
    });

    this.csaResourceMetadataWriter = new ProjectIamMember(this, "cluster_service_account_resourceMetadata_writer", {
      project: vars.project,
      role: "roles/resourcemanager.resourceMetadata.writer",
      member: `serviceAccount:${this.clusterServiceAccount.email}`,
    });

    this.csaGcrAdmin = new ProjectIamMember(this, "cluster_service_account_gcr", {
      project: vars.project,
      role: "roles/storage.objectViewer",
      member: `serviceAccount:${this.clusterServiceAccount.email}`,
    });

  }
}
