resource_group_name = "945-83973b07-create-and-peer-an-application-virtua"
naming_prefix       = "tacowagon"
vnet_address_space  = ["10.42.0.0/16"]
common_tags = {
  environment = "dev"
}
subnet_configuration = {
  "web" = "10.42.0.0/24"
  "app" = "10.42.1.0/24"
}

hub_vnet = {
  name                = "globomatics-hub-network"
  resource_group_name = "945-83973b07-create-and-peer-an-application-virtua"
}