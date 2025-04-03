data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

data "azurerm_subnet" "app" {
  name                 = var.subnet_name
  virtual_network_name = var.vnet_name
  resource_group_name  = data.azurerm_resource_group.rg.name
}



resource "azurerm_public_ip" "app" {
  name                = "pip-${var.vm_name}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  allocation_method   = "Static"
}


resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = "4096"
}

module "linux" {
  source                     = "Azure/virtual-machine/azurerm"
  version                    = "1.1.0"
  location                   = data.azurerm_resource_group.rg.location
  image_os                   = "linux"
  resource_group_name        = data.azurerm_resource_group.rg.name
  allow_extension_operations = false
  boot_diagnostics           = true
  new_network_interface = {
    ip_forwarding_enabled = false
    ip_configurations = [
      {
        public_ip_address_id = azurerm_public_ip.app.id
        primary              = true
      }
    ]
  }
  admin_username = "var.admin_username"
  admin_ssh_keys = [
    {
      public_key = tls_private_key.ssh.public_key_openssh
    }
  ]
  name = var.vm_name
  os_disk = {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  os_simple = "UbuntuServer"
  size      = "Standard_F2"
  subnet_id = data.azurerm_subnet.app.id
  custom_data = base64encode(templatefile("${path.module}/custom_data.tpl", {
    port           = var.application_port
    admin_username = var.admin_username
  }))
}



