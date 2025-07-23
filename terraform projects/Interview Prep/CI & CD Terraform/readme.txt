What Happens When a Git Commit is Made:
A developer updates the VM size in main.tf or modifies dev.tfvars.

They push the change to the main branch.

The Azure DevOps pipeline is automatically triggered.

The pipeline:

Initializes Terraform.

Plans the infrastructure changes.

Applies the changes (terraform apply) to Azure in a controlled, repeatable way.

VMs are automatically provisioned, updated, or destroyed based on the commit.

✅ Key Benefits:
No manual provisioning — reduces human error.

All infrastructure changes are version-controlled.

Environment-specific configurations via .tfvars.

Scalable and repeatable across dev, QA, and prod.