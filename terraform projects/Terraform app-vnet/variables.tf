variable "resource_group_name" {
  description = "The name of the resource group in which to create the resources."
}

variable "naming_prefix" {
  description = "A short prefix to identify the resource."
}

variable "vnet_address_space" {
  description = "The address space that is used the virtual network."
  type        = list(string)
}

variable "common_tags" {
  description = "Tags that are applied to all resources."
  type        = map(string)
}

variable "subnet_configuration" {
  description = "The configuration of the subnets to create in the virtual network."
  type        = map(string)
}

variable "hub_vnet" {
  description = "The name of the hub virtual network."
  type = object({
    name                = string
    resource_group_name = string
  })
}