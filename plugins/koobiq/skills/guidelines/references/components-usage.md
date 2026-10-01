# Choosing and composing Koobiq components

Before suggesting a component, confirm it is exported by the installed
version: `node_modules/@koobiq/react-components/dist/index.d.ts` (follow the
`export *` chain) or the checker inventory. Docs per component:
`https://react.koobiq.io/llms/components-<lowercase name>.txt` (latest
release — the installed d.ts wins when they disagree).

## What to use instead

| Need                                                     | Koobiq                                                                                                               |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| button, icon-only button, split action                   | `Button`, `IconButton`, `SplitButton`, `ButtonGroup`, `ButtonToggleGroup`                                            |
| link (looks like a link) / link that looks like a button | `Link` / `Button as="a" href`                                                                                        |
| text, email, password, url input                         | `Input`                                                                                                              |
| number / search input                                    | `InputNumber` / `SearchInput`                                                                                        |
| multi-line text                                          | `Textarea`                                                                                                           |
| checkbox, checkbox group, radio group, switch            | `Checkbox`, `CheckboxGroup`, `RadioGroup` + `Radio`, `Toggle`                                                        |
| select / combobox / tags input                           | `SelectNext` (not the deprecated `Select`) / `Autocomplete` / `TagInput`, `TagAutocomplete`                          |
| date, date input, calendar, time, period                 | `DatePicker`, `DateInput`, `Calendar`, `TimePicker`, `TimeRange`                                                     |
| file picker / upload area                                | `FileTrigger` / `FileUpload`                                                                                         |
| dialog / drawer                                          | `Modal` / `SidePanel`                                                                                                |
| popover, tooltip, dropdown, context menu                 | `Popover`, `Tooltip`, `DropdownMenu`, `Menu`                                                                         |
| tabs, accordion                                          | `Tabs`, `Accordion`                                                                                                  |
| table, list, tree, tree select                           | `Table`, `List`, `Tree`, `TreeSelect`                                                                                |
| toast / inline alert                                     | `ToastProvider` + `toast.add()` / `Alert`                                                                            |
| badge, tag, chips                                        | `Badge`, `Tag`, `TagGroup`, `TagList`                                                                                |
| progress, spinner, skeleton                              | `ProgressBar`, `ProgressSpinner`, `SkeletonBlock`, `SkeletonTypography`                                              |
| empty state, key-value list, divider                     | `EmptyState`, `DescriptionList`, `Divider`                                                                           |
| breadcrumbs, top bar, navigation                         | `Breadcrumbs`, `TopBar`, `TopNavbar`, `SideNavbar` (not the deprecated `Navbar`), `Sidebar`                          |
| text styles, truncation, search highlight                | `Typography`, `ClampedText`, `ClampedList`, `Highlight`                                                              |
| layout                                                   | `FlexBox`, `Grid`, `Container`, helpers `flex()` and `spacing()`                                                     |
| user avatar/name, country flag                           | `Username`, `Flag`                                                                                                   |
| panels, resizable areas, bulk actions                    | `ContentPanel`, `Resizable`, `ActionsPanel`                                                                          |
| markdown / code                                          | `Markdown` from `/markdown`, `CodeBlock` from `/code-block`                                                          |
| icons                                                    | `@koobiq/react-icons` (`Icon<Name><Size>`, e.g. `IconChevronRight16`); `IconItem` for an icon in a colored container |

## Rules

**component/raw-element** — raw `<button>`, `<input>`, `<select>`,
`<textarea>` (warning) and `<a href>`, `<hr>`, `<table>`, `<dialog>`,
`<progress>`, `<details>` (info) where Koobiq has a component · both · use
the mapped component · FP: `input type="hidden|submit|reset|image|color|range"`,
HTML rendered from Markdown/CMS, third-party widgets, tests.

**import/other-ui-kit** — MUI, Ant Design, Chakra, Mantine, Radix, shadcn
`components/ui/*`, Headless UI, react-select, react-toastify, sonner… for
patterns Koobiq covers · warning · script · migrate to the mapped component
· FP: data grids, charts, rich-text editors, maps, drag-and-drop — keep them
and record an exception.

**import/other-icons** — icons come from `@koobiq/react-icons`, not
lucide-react, react-icons, Heroicons, MUI icons… · warning · script · pick
by name and size from `node_modules/@koobiq/react-icons/manifest.json`
(names + keywords) · FP: logos and illustrations.

**component/reimplementation** — hand-rolled dialogs, drawers, tooltips,
popovers, menus, tabs, toasts, spinners, skeletons, badges, empty states,
breadcrumbs (look for `createPortal`, focus traps, `role="dialog|menu|tab"`,
hover-state CSS on divs) · warning · agent · FP: wrappers that compose
Koobiq components.

**component/slot-composition** — compound components are composed from
their slots: `Modal.Header` / `Modal.Body` / `Modal.Footer`,
`SidePanel.Header|Body|Footer`, `Accordion.Summary|Details`, `Table.*`
(check the `& { Slot: … }` members in `<Name>.d.ts`). Deprecated standalone
slots (`ModalHeader`, `ModalContent`, `ModalFooter`, `SidePanel*`,
`Popover*`) are `deprecated/export` · warning (error for a slot outside its
root) · agent.

**component/overlay-control** — `Modal`, `Popover` and `Tooltip` take a
`control` render prop; spread its props (including the ref) onto a focusable
Koobiq control: `control={(props) => <Button {...props}>Open</Button>}` ·
error · agent · FP: forwardRef components that pass props through.

**component/layout-utilities** — trivial flex/grid wrappers can use
`FlexBox` / `Grid` or the `flex()` / `spacing()` class helpers with token
sizes · info · agent · FP: complex layouts.

**component/experimental-usage** — components whose docs show
`<Status variant="experimental" />` may change in a minor release (the
package is 0.x); pin the version and wrap usage behind a local component
· info · agent · report only in audits and upgrades.
