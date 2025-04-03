variable "resource_group_name" {
  description = "The name of the resource group in which to create the resources."

}

variable "prefix" {
  description = "A prefix used for all resources in this example."

}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

resource "azurerm_container_group" "main" {
  name                = "${var.prefix}-container-group"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name
  ip_address_type     = "Public"
  dns_name_label      = "${var.prefix}-container-group"

  os_type = "Linux"

  container {
    name   = "example"
    image  = "mcr.microsoft.com/azuredocs/aci-helloworld"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  tags = {
    environment = "testing"
  }
}

output "container_group_fqdn" {
  value = azurerm_container_group.main.fqdn
}