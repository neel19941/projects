variable "resource_group_name" {
  description = "The name of the resource group in which to create the virtual machine."

}

variable "vnet_name" {
  description = "The name of the virtual network in which to create the virtual machine."

}

variable "subnet_name" {
  description = "The name of the subnet in which to create the virtual machine."
  default     = "app"
}

variable "application_port" {
  description = "The port on which the application will listen."
  default     = 80
}

variable "vm_name" {
  description = "The name of the virtual machine."
  default     = "taco-wagon-app"
}

variable "admin_username" {
  description = "The username for the virtual machine."
  default     = "adminuser"
}