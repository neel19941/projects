data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

data "azurerm_subnet" "web" {
  name                 = var.subnet_name
  virtual_network_name = var.vnet_name
  resource_group_name  = data.azurerm_resource_group.rg.name
}

module "tacoweb" {
  source                  = "Azure/loadbalancer/azurerm"
  version                 = "4.4.0"
  resource_group_name     = data.azurerm_resource_group.rg.name
  location                = data.azurerm_resource_group.rg.location
  type                    = "public"
  pip_sku                 = "Standard"
  allocation_method       = "Static"
  lb_sku                  = "Standard"
  prefix                  = var.prefix
  
  
  
  

  lb_port = {
    http = ["80", "Tcp", "${var.application_port}"]
  }

  lb_probe = {
    http = ["Http", "${var.application_port}", "/"]
  }

}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = "4096"
}

resource "azurerm_linux_virtual_machine_scale_set" "taco" {
  name                = "${var.prefix}-vmss"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  sku                 = "Standard_DS1_v2"
  instances           = 2
  admin_username      = var.admin_username

  admin_ssh_key {
    username   = var.admin_username
    public_key = tls_private_key.ssh.public_key_openssh
  }


  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  network_interface {
    name                      = "${var.prefix}-nic"
    network_security_group_id = azurerm_network_security_group.nsg.id
    primary                   = true

    ip_configuration {
      name                                   = "taco-ip-cfg"
      subnet_id                              = data.azurerm_subnet.web.id
      load_balancer_backend_address_pool_ids = [module.tacoweb.azurerm_lb_backend_address_pool_id]
    }
  }

  health_probe_id = module.tacoweb.azurerm_lb_probe_ids[0]

  custom_data = base64encode(templatefile("${path.module}/custom_data.tpl", {
    port           = var.application_port
    admin_username = var.admin_username
  }))
}