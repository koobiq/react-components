# Delegation prompt for koobiq:reviewer

Send one Agent call per batch with `subagent_type: "koobiq:reviewer"` and a
`description` like `Koobiq review batch-02`. Fill the placeholders; use
absolute paths with forward slashes.

````text
MODE=review OUTPUT=json LANGUAGE=<ru|en|…> PLUGIN_ROOT=<plugin root> BATCH_FILE=<runDir>/batch-02.json

Review the files in BATCH_FILE for conformance with the Koobiq design system.
Project root: <root>. Installed @koobiq/react-components <ds.version> at <ds.dir>;
@koobiq/design-tokens <tokens.version> at <tokens.dir> (token set: <tokens.set>).
The checker already ran; its candidates are in the batch file — triage each one.
Follow your procedure and evidence rules. Report findings only inside the changed
ranges listed for each file. Answer with exactly one ```json block.
<only for the setup batch:>
This is the project setup batch: verify the setup findings (token imports, style.css,
Provider, theme class, peers, fonts) and check setup/theme-class-scope.
<only for --deep, second wave:>
MODE=verify: re-check only these findings: <list of id + file:line>. Confirm or reject each.
````

Audit mode (from the cost gate): add
`Audit mode: verify the candidates; do an open review only of: <files>.`
