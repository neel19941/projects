data "terraform_remote_state"  "cluster" {
    backend = "local"
    config = {
        path = "../aks cluster/terraform.tfstate"
    }
}

resource "kubernetes_manifest" "flux_source" {
    manifest = {
        apiVersion = "source.toolkit.fluxcd.io/v1beta1"
        kind = "GitRepository"
        metadata = {
            name = "sampleapp"
            namespace = "flux-system"
        }
        spec = {
            interval = "1m"
            url = var.flux_git_url
            ref = {
            branch = var.flux_git_branch
        }
    }
  }
}


resource "kubernetes_manifest" "flux_infra" {
    manifest = {
        apiVersion = "kustomize.toolkit.fluxcd.io/v1beta1"
        kind = "Kustomization"
        metadata = {
            name = "infra"
            namespace = "flux-system"
        }
        spec = {
            path = "./infrastructure"
            prune = true
            interval = "30m"
            sourceRef = {
                kind = "GitRepository"
                name = "sampleapp"
            }
    }
  }
}

resource "kubernetes_manifest" "flux_app" {
    manifest = {
        apiVersion = "kustomize.toolkit.fluxcd.io/v1beta1"
        kind = "Kustomization"
        metadata = {
            name = "dotnetapp"
            namespace = "flux-system"
        }
        spec = {
            path = "./dotnet-lb"
            prune = true
            interval = "30m"
            sourceRef = {
                kind = "GitRepository"
                name = "sampleapp"
            }
    }
  }
}