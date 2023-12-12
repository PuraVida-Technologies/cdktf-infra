import { Construct } from "constructs";
import { BastionVariables } from "./variables";
import { ProjectIamCustomRole } from "@cdktf/provider-google/lib/project-iam-custom-role";

export class BastionPlatformRoles extends Construct {
  public platformMake: ProjectIamCustomRole;
  public platformDestroy: ProjectIamCustomRole;

  constructor(scope: Construct, id: string, vars: BastionVariables) {
    super(scope, id);

    this.platformMake = new ProjectIamCustomRole(this, "platform_make", {
      project: vars.project,
      roleId: `${vars.namePrefix}-platform-make`.replace(/-/g, "_"),
      title: "Create Platform",
      description: `Role for executing platform TF files for ${vars.namePrefix}`,
      permissions: [
        "logging.logMetrics.create",
        "logging.logMetrics.get",
        "logging.logMetrics.list",
        "logging.logMetrics.update",
        "compute.backendBuckets.create",
        "compute.backendBuckets.get",
        "compute.backendBuckets.use",
        "compute.addresses.create",
        "compute.addresses.createInternal",
        "compute.addresses.get",
        "compute.globalAddresses.createInternal",
        "compute.globalAddresses.create",
        "compute.globalAddresses.get",
        "compute.globalAddresses.use",
        "compute.globalForwardingRules.create",
        "compute.globalForwardingRules.get",
        "compute.globalOperations.get",
        "compute.firewalls.create",
        "compute.firewalls.get",
        "compute.firewalls.update",
        "compute.instanceGroupManagers.get",
        "compute.networks.get",
        "compute.networks.use",
        "compute.networks.updatePolicy",
        "compute.regionOperations.get",
        "compute.sslCertificates.create",
        "compute.sslCertificates.get",
        "compute.subnetworks.get",
        "compute.subnetworks.use",
        "compute.subnetworks.create",
        "compute.targetHttpsProxies.create",
        "compute.targetHttpsProxies.get",
        "compute.targetHttpsProxies.use",
        "compute.targetHttpProxies.create",
        "compute.targetHttpProxies.get",
        "compute.targetHttpProxies.use",
        "compute.urlMaps.create",
        "compute.urlMaps.get",
        "compute.urlMaps.use",
        "compute.zones.get",
        "compute.zones.list",
        "servicenetworking.services.addPeering",
        "servicenetworking.services.get",
        "cloudsql.instances.create",
        "cloudsql.instances.get",
        "cloudsql.instances.update",
        "cloudsql.users.create",
        "cloudsql.users.list",
        "cloudsql.instances.list",
        "bigquery.connections.create",
        "bigquery.connections.get",
        "bigquery.connections.getIamPolicy",
        "bigquery.connections.setIamPolicy",
        "monitoring.timeSeries.list",
      ]
    });

    this.platformDestroy = new ProjectIamCustomRole(this, "platform_destroy", {
      project: vars.project,
      roleId: `${vars.namePrefix}-platform-destroy`.replace(/-/g, "_"),
      title: "Destroy Platform",
      description: "Role for destroying the platform ${local.name_prefix}",
      permissions: [
        "logging.logMetrics.delete",
        "compute.backendBuckets.delete",
        "compute.addresses.delete",
        "compute.addresses.deleteInternal",
        "compute.globalAddresses.delete",
        "compute.globalForwardingRules.delete",
        "compute.firewalls.delete",
        "compute.sslCertificates.delete",
        "compute.subnetworks.delete",
        "compute.targetHttpsProxies.delete",
        "compute.targetHttpProxies.delete",
        "compute.urlMaps.delete",
        "compute.networks.removePeering",
        "compute.globalAddresses.deleteInternal",
        "cloudsql.instances.delete",
        "cloudsql.users.delete",
        "bigquery.connections.delete",
      ]
    });
  }
}
