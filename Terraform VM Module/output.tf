output "app_subnet_id" {
  value = data.azurerm_subnet.app.id

}

output "app_public_ip" {
  value = azurerm_public_ip.app.ip_address
}