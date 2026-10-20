#!/usr/bin/env bash
set -euo pipefail

here=$(cd -- "$(dirname -- "$0")" && pwd)
helper=$here/staging-release.sh
root=$(mktemp -d)
trap 'rm -rf -- "$root"' EXIT
export BOTANIKA_ROOT=$root
releases=$root/releases
mkdir -p "$releases"

fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }

make_release() {
  mkdir "$releases/$1"
  printf '%s\n' "$1" >"$releases/$1/index.html"
}

current_is() {
  local target
  target=$(readlink -- "$root/current" 2>/dev/null) || fail "current missing, expected $1"
  [ "$target" = "releases/$1" ] || fail "current=$target, expected releases/$1"
}

previous_is() {
  local target
  if [ "$1" = none ]; then
    [ ! -L "$root/previous" ] || fail "previous exists, expected none"
    return 0
  fi
  target=$(readlink -- "$root/previous" 2>/dev/null) || fail "previous missing, expected $1"
  [ "$target" = "releases/$1" ] || fail "previous=$target, expected releases/$1"
}

expect_ok() {
  local want=$1
  shift
  if ! "$helper" "$@" >"$root/.out" 2>"$root/.err"; then
    cat "$root/.err" >&2
    fail "$* exited nonzero"
  fi
  [ "$(cat "$root/.out")" = "$want" ] || fail "$* stdout '$(cat "$root/.out")', expected '$want'"
  [ ! -s "$root/.err" ] || fail "$* wrote stderr"
}

expect_fail() {
  local desc=$1
  shift
  if "$helper" "$@" >"$root/.out" 2>"$root/.err"; then
    fail "$desc: expected failure"
  fi
  [ ! -s "$root/.out" ] || fail "$desc: wrote stdout"
  [ -s "$root/.err" ] || fail "$desc: no stderr"
}

initial=20261019T094542Z
new1=sha111-1-1
new2=sha222-2-1
missing=sha999-9-1

make_release "$initial"
expect_ok "$initial" activate "$initial"
current_is "$initial"
previous_is none

expect_fail "rollback without previous" rollback
current_is "$initial"
previous_is none

make_release "$new1"
expect_ok "$new1" activate "$new1"
current_is "$new1"
previous_is "$initial"

make_release "$new2"
expect_ok "$new2" activate "$new2"
current_is "$new2"
previous_is "$new1"

expect_ok "$new2" activate "$new2"
current_is "$new2"
previous_is "$new1"

expect_ok "$new1" rollback
current_is "$new1"
previous_is "$new2"

expect_ok "$new2" rollback
current_is "$new2"
previous_is "$new1"

expect_ok "$initial" rollback "$initial"
current_is "$initial"
previous_is "$new2"

expect_fail "missing release" activate "$missing"
current_is "$initial"
previous_is "$new2"

mkdir "$releases/incomplete"
expect_fail "incomplete release" activate incomplete
current_is "$initial"
previous_is "$new2"

expect_fail "traversal release" activate "../$initial"
current_is "$initial"
previous_is "$new2"

ln -s "$initial" "$releases/linked"
expect_fail "symlinked release" activate linked
current_is "$initial"
previous_is "$new2"

mkdir "$root/outside"
printf 'outside\n' >"$root/outside/index.html"
ln -s "$root/outside" "$releases/escape"
expect_fail "escaping symlink" activate escape
current_is "$initial"
previous_is "$new2"

mkdir "$releases/badindex"
ln -s "../$initial/index.html" "$releases/badindex/index.html"
expect_fail "symlinked index" activate badindex
current_is "$initial"
previous_is "$new2"

expect_fail "missing explicit rollback" rollback "$missing"
current_is "$initial"
previous_is "$new2"

rm -f "$root/previous"
ln -s "releases/$missing" "$root/previous"
expect_fail "invalid previous" rollback
current_is "$initial"

rm "$root/previous"
printf 'not a link\n' >"$root/previous"
expect_fail "non-symlink previous" activate "$new1"
current_is "$initial"

printf 'ok\n'
