// The React components, rendered from the built package (dist/) exactly as a
// site imports them. No JSX here so the preview needs no extra build step.
import { createElement as h, Fragment, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  A11yButton,
  A11yPanel,
  A11yProvider,
  Badge,
  Button,
  CloseIcon,
  Eyebrow,
  GitHubIcon,
  IconButton,
  Input,
  InstagramIcon,
  Label,
  MenuIcon,
  Segmented,
  Sheet,
  SiteFooter,
  SiteHeader,
  Switch,
  Textarea,
  Wordmark,
} from "../dist/index.js";

const STAGE_TONES = ["paper", "red", "green", "ink"];
const BUTTON_TONES = ["cream", "yellow", "red", "green", "purple", "ink", "ghost"];
const SITES = ["the404labs", "404shop", "404games"];

const Row = ({ label, children }) =>
  h("div", { className: "demo-row" }, h("code", null, label), h("div", { className: "demo-items" }, children));

function Controls({ tone }) {
  const [size, setSize] = useState("md");
  const [on, setOn] = useState(true);
  const id = `demo-${tone}`;
  return h(
    Fragment,
    null,
    h(
      Row,
      { label: "Segmented" },
      h(Segmented, {
        "aria-label": `Example sizes on ${tone}`,
        value: size,
        onChange: setSize,
        options: [
          { value: "sm", label: "S" },
          { value: "md", label: "M" },
          { value: "lg", label: "L" },
        ],
      }),
    ),
    h(Row, { label: "Switch" }, h(Switch, { checked: on, onChange: setOn, "aria-label": `Example switch on ${tone}` })),
    h(
      Row,
      { label: "Label, Input, Textarea" },
      h(
        "div",
        { className: "demo-fields" },
        h(Label, { htmlFor: `${id}-name` }, "Name"),
        h(Input, { id: `${id}-name`, placeholder: "Ada Lovelace" }),
        h(Label, { htmlFor: `${id}-note` }, "Note"),
        h(Textarea, { id: `${id}-note`, rows: 2, placeholder: "Anything we should know?" }),
      ),
    ),
  );
}

function Stage({ tone }) {
  return h(
    "div",
    { className: "demo-stage", "data-tone": tone },
    h(Eyebrow, null, `On data-tone="${tone}"`),
    h(Row, { label: "Button tone=" }, BUTTON_TONES.map((t) => h(Button, { key: t, tone: t }, t))),
    h(
      Row,
      { label: "Button size, disabled, as" },
      h(Button, { size: "sm" }, "Small"),
      h(Button, { disabled: true }, "Disabled"),
      h(Button, { as: "a", href: "#components" }, "A link"),
    ),
    h(
      Row,
      { label: "IconButton md, sm, xs, ghost" },
      h(IconButton, { label: "Menu" }, h(MenuIcon)),
      h(IconButton, { label: "Instagram", size: "sm" }, h(InstagramIcon)),
      h(IconButton, { label: "GitHub", size: "xs" }, h(GitHubIcon)),
      h(IconButton, { label: "Close", tone: "ghost" }, h(CloseIcon)),
    ),
    h(Controls, { tone }),
  );
}

function Sheets() {
  const [open, setOpen] = useState(null);
  const close = () => setOpen(null);
  return h(
    "div",
    { className: "demo-stage", "data-tone": "paper" },
    h(Eyebrow, null, "Sheet"),
    h(
      Row,
      { label: "side=" },
      h(Button, { onClick: () => setOpen("end") }, "end (default)"),
      h(Button, { onClick: () => setOpen("left") }, "left"),
    ),
    h(
      Sheet,
      { open: open === "end", onClose: close, title: "A sheet", subtitle: "A bottom sheet on a phone, a side panel from 768px.", closeLabel: "Close sheet" },
      h("p", null, "Backdrop, focus trap, Escape, scroll lock and focus restore come with it."),
    ),
    h(
      Sheet,
      { open: open === "left", onClose: close, side: "left", tone: "paper", title: "Menu", closeLabel: "Close menu" },
      h("p", null, "The left side is the site menu at every width."),
    ),
  );
}

function Marks() {
  return h(
    "div",
    { className: "demo-stage", "data-tone": "paper" },
    h(Eyebrow, null, "Wordmark and Badge"),
    h(Row, { label: "Wordmark name=" }, SITES.map((name) => h(Wordmark, { key: name, name, className: "demo-wordmark" }))),
    h(Row, { label: "Badge size=" }, h(Badge, { size: 64 }), h(Badge, { size: 40 }), h(Badge, { size: 24 })),
  );
}

function Preview() {
  const [panelOpen, setPanelOpen] = useState(false);
  return h(
    A11yProvider,
    null,
    h(SiteHeader, {
      site: "the404labs",
      tone: "paper",
      controls: h(A11yButton, { "aria-expanded": panelOpen, onClick: () => setPanelOpen(true) }),
    }),
    h(A11yPanel, { open: panelOpen, onClose: () => setPanelOpen(false) }),
    h(
      "p",
      { className: "demo-note" },
      "The header above, the footer below and the accessibility panel behind the first header button are the real SiteHeader, SiteFooter and A11yPanel.",
    ),
    STAGE_TONES.map((tone) => h(Stage, { key: tone, tone })),
    h(Marks),
    h(Sheets),
  );
}

/** Mounts the component reference into `target` and the shared footer into `footer`. */
export function mountComponents(target, footer) {
  createRoot(target).render(h(Preview));
  createRoot(footer).render(h(SiteFooter, { site: "the404labs" }));
}
