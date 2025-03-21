data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

locals {
  vnet_name = "${var.naming_prefix}-taconet"
}
module "vnet" {
  source              = "Azure/vnet/azurerm"
  version             = "5.0.0"
  resource_group_name = data.azurerm_resource_group.main.name
  use_for_each        = true
  vnet_location       = data.azurerm_resource_group.main.location

  vnet_name       = local.vnet_name
  address_space   = var.vnet_address_space
  subnet_names    = keys(var.subnet_configuration)
  subnet_prefixes = values(var.subnet_configuration)
  tags            = var.common_tags
}

data "azurerm_virtual_network" "hub" {
  name                = var.hub_vnet.name
  resource_group_name = var.hub_vnet.resource_group_name
}

resource "azurerm_virtual_network_peering" "spoketoHub" {
  name                      = "${local.vnet_name}-to-${var.hub_vnet.name}"
  resource_group_name       = data.azurerm_resource_group.main.name
  virtual_network_name      = module.vnet.vnet_name
  remote_virtual_network_id = data.azurerm_virtual_network.hub.id
}

resource "azurerm_virtual_network_peering" "hubtospoke" {
  name                      = "${var.hub_vnet.name}-to-${local.vnet_name}"
  resource_group_name       = var.hub_vnet.resource_group_name
  virtual_network_name      = var.hub_vnet.name
  remote_virtual_network_id = module.vnet.vnet_id
}