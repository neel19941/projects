
variable "resource_group_name" {
  description = "The name of the resource group in which to create the resources"
  type        = string
}

# Declare the prefix variable
variable "prefix" {
  description = "The prefix which should be used for all resources"
  type        = string
  default     = "tacowagon"
}

variable "common_tags" {
  description = "Map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}

variable "vnet_address_space" {
  description = "List of address spaces to use for the VNET."
  type        = list(string)
}

variable "subnet_configuration" {
  description = "Map of subnets to create in the VNET. Key is subnet name, value is address spaces."
  type        = map(string)
}

