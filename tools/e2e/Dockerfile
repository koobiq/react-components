# syntax=docker/dockerfile:1
#
# The environment the screenshot baselines belong to. Run it with `pnpm e2e:docker`.
ARG PLAYWRIGHT_VERSION

# Pinned by digest (the multi-platform index): a re-pushed tag would change the baselines.
# Bump it together with @playwright/test and regenerate the baselines:
#   docker buildx imagetools inspect mcr.microsoft.com/playwright:v<version>-noble
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e

WORKDIR /app

# HUSKY=0: `pnpm install` runs the `prepare` script, and there is no .git in the image.
ENV CI=true \
  TZ=UTC \
  HUSKY=0 \
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Node from .nvmrc, as in the other CI jobs.
COPY .nvmrc ./
RUN set -eux; \
    node_version="$(tr -d '\r\n' < .nvmrc)"; \
    npx --yes n@10.2.0 "$node_version"; \
    rm -rf /usr/local/n "$HOME/.npm"; \
    test "v$node_version" = "$(node --version)"

# Manifests only, so that the dependencies are reinstalled only when they change.
# A new package under packages/ has to be listed here.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/logger/package.json packages/logger/
COPY packages/core/package.json packages/core/
COPY packages/primitives/package.json packages/primitives/
COPY packages/components/package.json packages/components/

RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Only the test components are an input of the Storybook build, so editing the specs or their
# helpers keeps this layer cached. The COPY after the build adds them back.
COPY --exclude=**/*.e2e.ts --exclude=**/__screenshots__ --exclude=packages/components/e2e/utils.ts --exclude=playwright.config.ts --exclude=tools/e2e . .
RUN pnpm e2e:build

COPY . .

ENTRYPOINT ["sh", "tools/e2e/entrypoint.sh"]
CMD ["pnpm", "e2e:components"]
