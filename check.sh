#!/bin/bash
echo "Running type check..."
pnpm typecheck
typecheck_exit=$?

echo "Running lint check..."
pnpm lint
lint_exit=$?

if [ $typecheck_exit -ne 0 ] || [ $lint_exit -ne 0 ]; then
  echo "Checks failed!"
  exit 1
fi

echo "All checks passed!"
exit 0 