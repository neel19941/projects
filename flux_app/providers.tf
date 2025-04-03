provider "kubernetes" {
    host = "https://${data.terraform_remote_state.cluster.outputs.host}"
    client_certificate = base64decode(data.terraform_remote_state.cluster.outputs.client_certificate)
    client_key = base64decode(data.terraform_remote_state.cluster.outputs.client_key)
    cluster_ca_certificate = base64decode(data.terraform_remote_state.cluster.outputs.cluster_ca_certificate)
  }