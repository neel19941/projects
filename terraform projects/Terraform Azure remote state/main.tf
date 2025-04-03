
variable "resource_group_name" {
  description = "The name of the resource group in which to create the resources."

}

variable "prefix" {
  description = "A prefix used for all resources in this example."

}

provider "azurerm" {
  features {}
  skip_provider_registration = true
  storage_use_azuread        = true
}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

resource "random_integer" "main" {
  min = 12312312
  max = 34341341
}

resource "azurerm_storage_account" "main" {
  name                      = "${var.prefix}storagetaco${random_integer.main.result}"
  resource_group_name       = data.azurerm_resource_group.main.name
  location                  = data.azurerm_resource_group.main.location
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  shared_access_key_enabled = true
  # Removed invalid attribute: default_to_oauth_authentication
  infrastructure_encryption_enabled = false

  blob_properties {
    versioning_enabled  = true
    change_feed_enabled = true
    # Removed unsupported attribute: change_feed_retention_days
    last_access_time_enabled = true
    delete_retention_policy {
      days = 30
    }
    container_delete_retention_policy {
      days = 30
    }
  }
}

resource "azurerm_storage_container" "main" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}


output "storage_account_name" {
  value = azurerm_storage_account.main.name
}