#!/bin/bash
#
# Offline install script for Castrel Proxy
# Usage: cd <directory containing this script and packages/> && bash install.sh
#
# User install (no sudo): CASTREL_INSTALL_DIR=~/.local/bin bash install.sh
# Ensure ~/.local/bin is in your PATH.
#
# Supports: Ubuntu 20+, Debian 10+, CentOS 7+, macOS
#

set -e

# Hardcoded version (tag includes "v" prefix)
VERSION="v1.0.6"

# REPO="castrel-ai/castrel-proxy"
# BASE_URL="https://github.com/${REPO}"
INSTALL_DIR="${CASTREL_INSTALL_DIR:-/usr/local/bin}"
# Expand ~ to $HOME for user install (e.g. CASTREL_INSTALL_DIR=~/.local/bin)
INSTALL_DIR="${INSTALL_DIR/#\~/$HOME}"
BINARY_NAME="castrel-proxy"

# Script directory (where the packages are located)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


declare -A PACKAGE_PATHS=(
  ["macos-arm64"]="packages/castrel-proxy-macos-arm64"
  ["macos-x86_64"]="packages/castrel-proxy-macos-x86_64"
  ["linux-x86_64"]="packages/castrel-proxy-linux-x86_64"
  ["linux-arm64"]="packages/castrel-proxy-linux-arm64"
)

declare -A CHECKSUM_PATHS=(
  ["macos-arm64"]="packages/castrel-proxy-macos-arm64.sha256"
  ["macos-x86_64"]="packages/castrel-proxy-macos-x86_64.sha256"
  ["linux-x86_64"]="packages/castrel-proxy-linux-x86_64.sha256"
  ["linux-arm64"]="packages/castrel-proxy-linux-arm64.sha256"
)

# Colors for output (strip if not a terminal)
if [ -t 1 ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  NC='\033[0m'
else
  RED='' GREEN='' YELLOW='' NC=''
fi

die() {
  echo -e "${RED}Error: $1${NC}" >&2
  exit 1
}

log() {
  echo -e "${GREEN}$1${NC}"
}

warn() {
  echo -e "${YELLOW}$1${NC}"
}


# Compute SHA256 (try sha256sum, then shasum, then openssl)
compute_sha256() {
  local file="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
  elif command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 "$file" | awk '{print $NF}'
  else
    die "No SHA256 tool found (sha256sum, shasum, or openssl required)."
  fi
}

# Detect OS and architecture
detect_platform() {
  local os
  local arch

  case "$(uname -s)" in
    Darwin)
      os="macos"
      ;;
    Linux)
      os="linux"
      ;;
    *)
      die "Unsupported OS: $(uname -s)"
      ;;
  esac

  case "$(uname -m)" in
    x86_64|amd64)
      arch="x86_64"
      ;;
    aarch64|arm64)
      arch="arm64"
      ;;
    *)
      die "Unsupported architecture: $(uname -m)"
      ;;
  esac

  echo "${os}-${arch}"
}

# # Get latest release info from GitHub API
# get_latest_release() {
#   local api_url="https://api.github.com/repos/${REPO}/releases/latest"
#   local dl_tool="$1"
#
#   if [ "$dl_tool" = "curl" ]; then
#     curl -fsSL "$api_url" 2>/dev/null || die "Failed to fetch release info. Check network and https://github.com/${REPO}/releases"
#   else
#     wget -q -O - "$api_url" 2>/dev/null || die "Failed to fetch release info. Check network and https://github.com/${REPO}/releases"
#   fi
# }

# # Parse JSON (minimal, no jq required) - get tag_name
# parse_tag() {
#   grep -o '"tag_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\(v[^"]*\)"$/\1/'
# }

main() {
  log "Castrel Proxy - Offline installer"
  echo ""

  # Hardcoded version (no longer fetching from GitHub)
  local tag="${VERSION}"
  log "Version: $tag"

  local platform
  platform=$(detect_platform)
  log "Detected platform: $platform"

  # Resolve local package path from hardcoded mapping
  local pkg_relative="${PACKAGE_PATHS[$platform]}"
  local sha_relative="${CHECKSUM_PATHS[$platform]}"

  [ -z "$pkg_relative" ] && die "No package configured for platform: $platform"

  local pkg_path="${SCRIPT_DIR}/${pkg_relative}"
  local sha_path="${SCRIPT_DIR}/${sha_relative}"

  [ -f "$pkg_path" ] || die "Package file not found: $pkg_path"
  [ -f "$sha_path" ] || die "Checksum file not found: $sha_path"

  local pkg_name
  pkg_name=$(basename "$pkg_path")
  log "Installing ${pkg_name} from local packages..."

  # Verify checksum
  local expected_hash
  expected_hash=$(awk '{print $1}' "$sha_path")
  local actual_hash
  actual_hash=$(compute_sha256 "$pkg_path")

  if [ "$expected_hash" != "$actual_hash" ]; then
    die "SHA256 verification failed. Expected: $expected_hash, got: $actual_hash"
  fi
  log "SHA256 checksum verified."

  # Install to target directory (create if needed for user install)
  local target_path="${INSTALL_DIR}/${BINARY_NAME}"
  if [ ! -d "$INSTALL_DIR" ]; then
    if mkdir -p "$INSTALL_DIR" 2>/dev/null; then
      :
    elif command -v sudo >/dev/null 2>&1; then
      sudo mkdir -p "$INSTALL_DIR" || die "Cannot create ${INSTALL_DIR}"
    else
      die "Directory ${INSTALL_DIR} does not exist and cannot be created."
    fi
  fi

  if [ -w "$INSTALL_DIR" ] 2>/dev/null; then
    cp "$pkg_path" "$target_path"
  else
    warn "Need sudo to install to ${INSTALL_DIR}"
    if command -v sudo >/dev/null 2>&1; then
      sudo cp "$pkg_path" "$target_path"
    else
      die "Cannot write to ${INSTALL_DIR} and sudo is not available."
    fi
  fi

  chmod +x "$target_path" 2>/dev/null || sudo chmod +x "$target_path"

  log "Installed successfully to $target_path"
  echo ""
  echo "Run: castrel-proxy --help"
  echo ""
}

main "$@"
