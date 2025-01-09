#!/bin/bash

echo -e "\n\033[1;32m===============================\033[0m"
echo -e "\033[1;36m   HURL TEST EXECUTION SCRIPT  \033[0m"
echo -e "\033[1;32m===============================\033[0m\n"

# HOST CONFIG
HOST="localhost"
PORT="3000"
HOST_URL="https://$HOST:$PORT"

echo -e "\033[1;34m> Host URL: \033[1;33m$HOST_URL\033[0m\n"

# Verifying host is up
echo -e "\033[1;34m> Verifying host is up...\033[0m"
for i in {1..3}; do echo -n "."; sleep 0.1; done
echo ""

if curl -s --head --fail http://$HOST:$PORT > /dev/null; then
  echo -e "\n\033[1;32m✓ Host is up.\033[0m\n"
else
  echo -e "\n\033[1;31m✗ Host is down. Exiting.\033[0m\n"
  exit 1
fi

# TEST CONFIG
TESTS_DIR="./*.hurl"

# Clean up function
cleanup() {
  echo -e "\033[1;33m> Running cleanup...\033[0m\n"

  cd ..

  bun run reset > /dev/null;

  echo -e "\033[1;32m✓ Cleanup completed.\033[0m"
}

# Run Hurl tests
echo -e "\033[1;34m> Running Hurl tests...\033[0m\n"
for i in {1..3}; do echo -n "."; sleep 0.1; done
echo ""

hurl $TESTS_DIR --error-format=long --test

# Verify test pass
if [ $? -eq 0 ]; then
  echo -e "\033[1;32m✓ All tests passed.\033[0m"
  echo -e "\033[1;34m> Initiating cleanup...\033[0m\n"
  cleanup 
  echo -e "\n\033[1;32m✓ TEST PASSED.\033[0m\n"
else
  echo -e "\033[1;31m✗ Test failed.\033[0m"
  echo -e "\033[1;34m> Initiating rollback...\033[0m\n"
  cleanup 
  echo -e "\n\033[1;31m✗ TEST FAILED.\033[0m\n"
fi

echo -e "\033[1;32m===============================\033[0m"
echo -e "\033[1;36m       SCRIPT COMPLETED        \033[0m"
echo -e "\033[1;32m===============================\033[0m\n"