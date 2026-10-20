#!/usr/bin/env bash
set -euo pipefail

die() { printf 'staging-release: %s\n' "$*" >&2; exit 1; }
usage() { die "usage: $0 activate RELEASE | rollback [RELEASE]"; }

ROOT=$(readlink -f -- "${BOTANIKA_ROOT:-/home/botanika}") || die "invalid BOTANIKA_ROOT"
[ -d "$ROOT" ] || die "missing BOTANIKA_ROOT: $ROOT"
RELEASES=$ROOT/releases
[ -d "$RELEASES" ] || die "missing releases directory: $RELEASES"
CURRENT=$ROOT/current
PREVIOUS=$ROOT/previous
TMP_CURRENT=$ROOT/.current.$$
TMP_PREVIOUS=$ROOT/.previous.$$
trap 'rm -f -- "$TMP_CURRENT" "$TMP_PREVIOUS"' EXIT

# Print the release id a root-level symlink points at, or fail.
target_id() {
  local target
  target=$(readlink -- "$1" 2>/dev/null) || return 1
  case $target in
    releases/*) printf '%s' "${target#releases/}" ;;
    "$ROOT"/releases/*) printf '%s' "${target#"$ROOT"/releases/}" ;;
    *) return 1 ;;
  esac
}

validate_release() {
  local id=$1 dir resolved
  case $id in
    [A-Za-z0-9]*) ;;
    *) die "invalid release: $id" ;;
  esac
  case $id in
    *[!A-Za-z0-9._-]*) die "invalid release: $id" ;;
  esac
  dir=$RELEASES/$id
  if [ ! -d "$dir" ]; then
    if [ -L "$dir" ]; then die "release is a symlink: $id"; else die "release not found: $id"; fi
  fi
  [ -L "$dir" ] && die "release is a symlink: $id"
  [ -f "$dir/index.html" ] || die "release missing index.html: $id"
  [ -L "$dir/index.html" ] && die "release index.html is a symlink: $id"
  resolved=$(readlink -f -- "$dir") || die "cannot resolve release: $id"
  [ "$resolved" = "$dir" ] || die "release outside releases: $id"
}

# Switch current to RELEASE and keep the old current as previous. Same release
# is a no-op so the previous link survives repeated deploys.
switch_to() {
  local release=$1 former
  former=
  if [ -L "$CURRENT" ]; then
    former=$(target_id "$CURRENT") || die "invalid current release"
  fi
  if [ "$former" = "$release" ]; then
    printf '%s\n' "$release"
    return 0
  fi
  [ -z "$former" ] || validate_release "$former"

  rm -f -- "$TMP_CURRENT" "$TMP_PREVIOUS"
  ln -s "releases/$release" "$TMP_CURRENT"
  mv -Tf -- "$TMP_CURRENT" "$CURRENT"
  if [ -n "$former" ]; then
    ln -s "releases/$former" "$TMP_PREVIOUS"
    mv -Tf -- "$TMP_PREVIOUS" "$PREVIOUS"
  fi
  printf '%s\n' "$release"
}

cmd=${1:-}
explicit=1
case $cmd in
  activate)
    [ $# -eq 2 ] || usage
    release=$2
    ;;
  rollback)
    [ $# -le 2 ] || usage
    release=${2:-}
    if [ $# -eq 2 ]; then explicit=1; else explicit=0; fi
    ;;
  *) usage ;;
esac

exec 9>"$ROOT/.deploy.lock" || die "cannot lock $ROOT"
flock 9

for link in "$CURRENT" "$PREVIOUS"; do
  [ ! -e "$link" ] || [ -L "$link" ] || die "expected a symlink: $link"
done

if [ "$explicit" -eq 0 ]; then
  [ -L "$PREVIOUS" ] || die "no previous release"
  release=$(target_id "$PREVIOUS") || die "invalid previous release"
fi
validate_release "$release"
switch_to "$release"
