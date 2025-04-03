# Provider config
provider "azurerm" {
  features {}
  skip_provider_registration = true
}

provider "helm" {
  kubernetes {
    host = module.cluster.cluster_fqdn
    client_certificate = base64decode(module.cluster.client_certificate)
    client_key = base64decode(module.cluster.client_key)
    cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
  }
}