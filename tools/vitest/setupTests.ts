import failOnConsole from 'vitest-fail-on-console';

// Expected warnings and errors must be mocked and asserted in the test itself.
failOnConsole({
  shouldFailOnWarn: true,
  shouldFailOnError: true,
});
