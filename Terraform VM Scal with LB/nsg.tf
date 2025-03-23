resource "azurerm_network_security_group" "nsg" {
  location            = data.azurerm_resource_group.rg.location
  name                = "nsg-${var.vm_name}"
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "http" {
  name                        = "http"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = var.application_port
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.nsg.name
  resource_group_name         = data.azurerm_resource_group.rg.name
}

