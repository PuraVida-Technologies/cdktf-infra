import { Construct } from "constructs";
import { BootstrapVariables } from "./variables";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { StorageBucketIamMember } from "@cdktf/provider-google/lib/storage-bucket-iam-member";
import { InceptionAccount } from "./inception-account";

export class StateBucket extends Construct {
  public bucket: StorageBucket;

  constructor(scope: Construct, id: string, variables: BootstrapVariables, inception: InceptionAccount) {
    super(scope, id);

    this.bucket = new StorageBucket(this, "tf_state", {
      name: variables.stateBucketName,
      project: variables.gcpProject,
      location: variables.stateBucketRegion,
      versioning: {
        enabled: true,
      },
      forceDestroy: variables.stateBucketForceDestroy,
    });

    new StorageBucketIamMember(this, "inception", {
      bucket: this.bucket.name,
      role: "roles/storage.admin",
      member: `serviceAccount:${inception.inceptionAccount.email}`,
    })
  }
}
