data "azurerm_resource_group" "network" {
  name = var.resource_group_name
}

# Create virtual network with subnets
module "spoke_vnet" {
  source  = "Azure/vnet/azurerm"
  version = "4.1.0"

  resource_group_name = data.azurerm_resource_group.network.name
  vnet_location       = data.azurerm_resource_group.network.location
  use_for_each        = true

  vnet_name       = data.azurerm_resource_group.network.name
  address_space   = var.vnet_address_space
  subnet_names    = keys(var.subnet_configuration)
  subnet_prefixes = values(var.subnet_configuration)

  tags = var.common_tags

}