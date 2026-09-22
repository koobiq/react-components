#!/bin/sh
# Runs the command, then copies Playwright's output to the bind mounts under /host: the reporters
# remove their output directories first, which a mount point does not allow.
set -u

for name in test-results playwright-report; do
  if [ -d "/host/$name" ]; then
    find "/host/$name" -mindepth 1 -delete
  fi
done

"$@"
status=$?

for name in test-results playwright-report; do
  if [ -d "/app/$name" ] && [ -d "/host/$name" ]; then
    cp -a "/app/$name/." "/host/$name/"
  fi
done

exit "$status"
