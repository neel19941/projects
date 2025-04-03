provider "azurerm" {
  features {
  }
  #skip_provider_registration = true
  subscription_id            = "0cfe2870-d256-4119-b0a3-16293ac11bdc"
  environment                = "public"
  use_msi                    = false
  use_cli                    = true
  use_oidc                   = false
}
