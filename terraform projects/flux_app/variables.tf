variable "flux_git_url" {
  description = "The URL of the git repository to sync with Flux"
  type        = string
  
}


variable "flux_git_branch" {
  description = "The branch of the git repository to sync with Flux"
  type        = string
  default     = "main"
  
}